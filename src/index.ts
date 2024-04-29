import express from "express"
import "./db/mongoose.js";
import { customerRouter } from "./routers/customer.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(customerRouter);

app.listen(port, () => {
  console.log("Server listening on", port);
});

