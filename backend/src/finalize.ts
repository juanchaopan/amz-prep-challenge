import { WithId } from "mongodb";
import { biddingCollection, preferredClientCollection } from "./mongo";
import { Bidding } from "./types/bidding";
import { BiddingStatus } from "./types/biddingStatus";

export async function finalize(bidding: WithId<Bidding>): Promise<void> {
    //find the lowest price
    const vendorPrices = bidding.vendorPrices;
    const lowestPrice = Math.min(...Object.values(vendorPrices));
    // check if preferred client
    const preferredClient = await preferredClientCollection.findOne({ client: bidding.client });
    // markup price by 5% for preferred clients, 10% for others
    const markup = preferredClient ? 0.05 : 0.1;
    const finalPrice = lowestPrice * (1 + markup);
    if (isFinite(finalPrice)) {
        await biddingCollection.updateOne(
            { _id: bidding._id },
            {
                $set: {
                    status: BiddingStatus.PROCESSED,
                    finalPrice: finalPrice
                }
            }
        );
        console.log(`
Quote for shipment from ${bidding.origin} to ${bidding.destination}:
- Cargo Type: ${bidding.cargoType}
- Weight: ${bidding.weight} kg
- Timeline: ${bidding.timeline} days
- Final Price: $${finalPrice.toFixed(2)}
`);
    } else {
        await biddingCollection.updateOne(
            { _id: bidding._id },
            {
                $set: {
                    status: BiddingStatus.CANCELLED,
                    finalPrice: finalPrice
                }
            }
        );
        console.log(`
Quote for shipment from ${bidding.origin} to ${bidding.destination}:
- Cargo Type: ${bidding.cargoType}
- Weight: ${bidding.weight} kg
- Timeline: ${bidding.timeline} days
- Final Price: $${finalPrice.toFixed(2)}
Unable to generate quote for shipment from ${bidding.origin} to ${bidding.destination}.
`);
    }
}

export async function planFinalization(bidding: WithId<Bidding>): Promise<void> {
    setTimeout(async () => {
        bidding = await biddingCollection.findOne({ _id: bidding._id }) ?? bidding;
        if (bidding.status == BiddingStatus.EXTRACTED) {
            await finalize(bidding);
        }
    }, 120000);
}