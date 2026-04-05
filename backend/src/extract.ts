import OpenAI from "openai";
import { WithId } from "mongodb";
import { Bidding } from "./types/bidding";
import { CargoType } from "./types/cargoTypes";
import { biddingCollection } from "./mongo";
import { nvidiaApiKey, nvidiaBaseUrl, nvidiaLanguageModel } from "./constants";
import { BiddingStatus } from "./types/biddingStatus";

const client = new OpenAI({
    apiKey: nvidiaApiKey,
    baseURL: nvidiaBaseUrl
});

const systemPrompt = `
Extract the following information from the shipping request message. Return as JSON with these fields:
- origin: string (departure location)
- destination: string (arrival location)
- weight: number (in kg, extract numeric value)
- cargoTypes: string (type of cargo, one of "general", "perishable", "hazardous", "liquid", "bulk")
- timeline: number (days until shipment, extract numeric value)

Return only valid JSON, no extra text.
`;

export async function extract(bidding: WithId<Bidding>): Promise<void> {
    try {
        const completion = await client.chat.completions.create({
            model: nvidiaLanguageModel,
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Message: "${bidding.message}"` }],
            max_tokens: 200,
            temperature: 0.0,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from OpenAI");
        }

        const extracted = JSON.parse(stripCodeFence(content));

        await biddingCollection.updateOne(
            { _id: bidding._id },
            {
                $set: {
                    origin: extracted.origin as string || "",
                    destination: extracted.destination as string || "",
                    weight: extracted.weight as number || 0,
                    cargoType: (extracted.cargoTypes as CargoType) || CargoType.GENERAL,
                    timeline: extracted.timeline as number || 0,
                    status: BiddingStatus.EXTRACTED,
                }
            }
        );

    } catch (error) {
        await biddingCollection.updateOne(
            { _id: bidding._id! },
            {
                $set: {
                    status: BiddingStatus.CANCELLED,
                    error: "Failed to extract information"
                }
            }
        );

        throw new Error(`Failed to extract information; ${error}`);
    }
}
export function stripCodeFence(text: string): string {
    if (!text) return text;
    const matched = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (matched?.[1]) return matched[1];
    return text.trim().replace(/^[` \n]+|[` \n]+$/g, "");
}