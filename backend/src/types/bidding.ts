import { ObjectId } from "mongodb";
import { BiddingStatus } from "./biddingStatus";
import { CargoType } from "./cargoTypes";

export interface Bidding {
    // initial
    _id?: ObjectId;
    message: string;
    client: string;
    // extracted
    origin: string;
    destination: string;
    weight: number;
    cargoType: CargoType;
    timeline: number;
    vendorPrices: Record<string, number>;
    // processed
    finalPrice: number;
    // status
    status: BiddingStatus;
    error: string;

}