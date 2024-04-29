import express from "express"
import { Customer } from "../models/customer.js"

export const customerRouter = express.Router();

customerRouter.post("/customers", (req, res) => {
  const customer = new Customer(req.body);
  customer.save().then((note) => {
    res.status(200).send(note)
  }).catch((error) => {
    res.status(400).send(error);
  });
});

customerRouter.delete("/customers", (req, res) => {
  const nif = req.query.nif;
  if (nif){
    Customer.findOneAndDelete({nif: nif}).then((customer) => {
      if (!customer) res.status(404).send("Customer not found");
      else res.status(200).send(customer);
    }).catch((error) => {
      res.status(400).send(error);
    })
  } else {
    res.status(400).send("Nif not provided");
  }
})
