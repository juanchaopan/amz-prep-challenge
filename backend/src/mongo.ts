import { Collection, MongoClient, ObjectId, ChangeStreamInsertDocument } from "mongodb";
import { mongoUri, mongoDb, mongoDbUsername, mongoDbPassword } from "./constants";
import { Bidding } from "./types/bidding";
import { PreferredClient } from "./types/preferredClient";
import { extract } from "./extract";

const client = new MongoClient(mongoUri, { auth: { username: mongoDbUsername, password: mongoDbPassword }, authSource: mongoDb });

const preferredClientCollection: Collection<PreferredClient> = client.db(mongoDb).collection("preferredClients");

const biddingCollection: Collection<Bidding> = client.db(mongoDb).collection("bidding");

export { client, preferredClientCollection, biddingCollection };
