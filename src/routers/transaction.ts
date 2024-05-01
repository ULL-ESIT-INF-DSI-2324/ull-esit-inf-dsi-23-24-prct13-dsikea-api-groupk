import express from "express"
import { Transaction } from "../models/transaction.js"
import { Furniture } from "../models/furniture.js"
import { Customer } from "../models/customer.js";
import { Provider } from "../models/provider.js";

export const transactionRouter = express.Router();


// Antes de todo, habria que realizar la comprobación de que los muebles involucrados esten en la base de datos y de que haya stock, lo eliminamos si se encuentran, por que se hizo la transaccion
// Comprobar también si el cliente/proveedor existe también en la base de datos, de otra manera intuyo que se tendra que crear.
transactionRouter.post("/transactions", async (req, res) => {
  const itemsIDs = new Set();
  const rawTransaction = req.body;
  rawTransaction.timestamp = new Date();
  rawTransaction.amount = rawTransaction.items.reduce((total: number, furniture: { price: number; }) => {
    return total + furniture.price;
  }, 0);
  
  try {
    for (const furniture of req.body.items || []) {
      const founds = await Furniture.find({ name: furniture.name });
      if (founds.length !== 0) {
        founds.forEach((element) => {
          itemsIDs.add(element._id.toString());
        });
      } else {
        return res.status(404).send(`Furniture ${furniture.name} not found`);
      }
    }
    rawTransaction.items = Array.from(itemsIDs);

    const populateOptions = [{
      path: "items",
      select: ["name"]
    }];

    if (rawTransaction.client) {
      const customer = await Customer.findOne({nif: rawTransaction.client.nif});
      if (customer) {
        rawTransaction.client = customer._id;
        populateOptions.push({
          path: "client",
          select: ["name"]
        });
      } 
      else return res.status(404).send("Client not found");
    }

    if (rawTransaction.company) {
      const provider = await Provider.findOne({cif: rawTransaction.company.cif});
      if (provider) {
        rawTransaction.company = provider._id;
        populateOptions.push({
          path: "company",
          select: ["name"]
        });
      } 
      else return res.status(404).send("Company not found");
    }



    console.log(rawTransaction);
    const transaction = new Transaction(rawTransaction);
    await transaction.save();

    await transaction.populate(populateOptions);
    
    return res.status(201).send(transaction);
  } catch (error) {
    return res.status(400).send(error);
  }
});
