import { Router, type Request, type Response } from "express";
import { ObjectId } from "mongodb";
import { biddingCollection } from "../mongo";
import { extract } from "../extract";
import { finalize, planFinalization } from "../finalize";
import { CargoType } from "../types/cargoTypes";

const biddingRouter = Router();

biddingRouter.post("/biddings", async (req: Request, res: Response) => {
    const { message, sender } = req.body ?? {};

    if (typeof message !== "string"
        || typeof sender !== "string") {
        return res.status(400).json({ error: "message and sender are required" });
    }

    try {
        const client = sender.substring(sender.indexOf("@") + 1);

        const query = { message, client };
        const existing = await biddingCollection.findOne(query);
        if (existing)
            return res.status(200).json({ id: existing._id });

        const result = await biddingCollection.insertOne({
            _id: new ObjectId(),
            message,
            client,
            origin: "",
            destination: "",
            weight: 0,
            cargoType: CargoType.GENERAL,
            timeline: 0,
            vendorPrices: {},
            finalPrice: 0,
            status: 100,
            error: "",
        });


        const bidding = await biddingCollection.findOne({ _id: result.insertedId })
        if (bidding) {
            await extract(bidding);
            await planFinalization(bidding);
        }

        return res.status(201).json({ id: result.insertedId });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to save message" });
    }
});

biddingRouter.post("/biddings/vendor-prices", async (req: Request, res: Response) => {
    const { biddingId, vendorId, price } = req.body ?? {};

    if (
        typeof biddingId !== "string"
        || typeof vendorId !== "string"
        || typeof price !== "number"
        || Number.isNaN(price)) {
        return res.status(400).json({ error: "biddingId, vendorId and price are required" });
    }

    if (!ObjectId.isValid(biddingId)) {
        return res.status(400).json({ error: "Invalid biddingId" });
    }

    try {
        const _id = new ObjectId(biddingId);

        const existing = await biddingCollection.findOne({ _id });
        if (!existing) {
            return res.status(404).json({ error: "Bidding not found" });
        }

        if(existing.status !== 200) {
            return res.status(400).json({ error: "Bidding is not open for vendor prices" });
        }

        const hasVendor = Object.prototype.hasOwnProperty.call(existing.vendorPrices ?? {}, vendorId);

        await biddingCollection.updateOne(
            { _id },
            { $set: { [`vendorPrices.${vendorId}`]: price } }
        );


        // if 5 vendors have submitted prices, finalize immediately
        const updated = await biddingCollection.findOne({ _id });
        if (updated) {
            const vendorCount = Object.keys(updated.vendorPrices ?? {}).length;
            if (vendorCount >= 5 && updated.status === 200) {
                await finalize(updated);
            }
        }

        return res.status(hasVendor ? 200 : 201).json({ id: biddingId, vendorId, price });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to save vendor price" });
    }
});

export { biddingRouter };