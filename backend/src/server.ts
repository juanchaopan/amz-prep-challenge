import express from "express";
import { biddingRouter } from "./routes/biddingsRouter";

const app = express();
app.use(express.json());
app.use(biddingRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`REST API listening on http://localhost:${port}`);
});
