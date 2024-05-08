import express from "express";
import "./db/mongoose.js";
import { defaultRouter } from "./routers/default.js";
import { customerRouter } from "./routers/customer.js";
import { providerRouter } from "./routers/provider.js";
import { furnitureRouter } from "./routers/furniture.js";
import { transactionRouter } from "./routers/transaction.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

/**
 * Instanciamos los routers
 */
app.use(customerRouter);
app.use(providerRouter);
app.use(furnitureRouter);
app.use(transactionRouter);
app.use(defaultRouter);

app.listen(port, () => {
  console.log("Server listening on", port);
});
