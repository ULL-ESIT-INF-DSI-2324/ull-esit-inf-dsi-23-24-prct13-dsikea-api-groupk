import express from "express";
import { Transaction } from "../models/transaction.js";
import { Furniture } from "../models/furniture.js";
import { Customer } from "../models/customer.js";
import { Provider } from "../models/provider.js";

export const transactionRouter = express.Router();

/**
 * Post de la transacción
 * @param {Date} timestamp - Fecha y hora de la transacción
 * @param {number} amount - Monto de la transacción
 * @param {CustomerDocumentInterface} client
 * @param {ProviderDocumentInterface} company
 * @param {FurnitureDocumentInterface[]} items
 * 
 */
transactionRouter.post("/transactions", async (req, res) => {
  const itemsIDs = new Set();
  const rawTransaction = req.body;
  rawTransaction.timestamp = new Date();
  rawTransaction.amount = rawTransaction.items.reduce(
    (total: number, furniture: { price: number }) => {
      return total + furniture.price;
    },
    0,
  );

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

    const populateOptions = [
      {
        path: "items",
        select: ["name"],
      },
    ];

    if (rawTransaction.client) {
      const customer = await Customer.findOne({
        nif: rawTransaction.client.nif,
      });
      if (customer) {
        rawTransaction.client = customer._id;
        populateOptions.push({
          path: "client",
          select: ["name"],
        });
      } else return res.status(404).send("Client not found");
    }

    if (rawTransaction.company) {
      const provider = await Provider.findOne({
        cif: rawTransaction.company.cif,
      });
      if (provider) {
        rawTransaction.company = provider._id;
        populateOptions.push({
          path: "company",
          select: ["name"],
        });
      } else return res.status(404).send("Company not found");
    }
    const transaction = new Transaction(rawTransaction);
    await transaction.save();

    await transaction.populate(populateOptions);

    return res.status(201).send(transaction);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Patch de la transacción
 * @param {string} id - ID de la transacción
 * @param {Date} timestamp - Fecha y hora de la transacción
 * @param {number} amount - Monto de la transacción
 * @param {CustomerDocumentInterface} client
 * @param {ProviderDocumentInterface} company
 * @param {FurnitureDocumentInterface[]} items
 * 
 */
transactionRouter.patch("/transactions/:id", async (req, res) => {
  const transactionId = req.params.id;
  const updates = req.body;

  try {
    // Verificar si se proporcionaron actualizaciones válidas (propios de la transaccion)
    const allowedUpdates = [
      "timestamp",
      "amount",
      "client",
      "company",
      "items",
    ];
    const isValidUpdate = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      return res.status(400).send("Invalid updates");
    }

    // Buscar la transacción por su ID y aplicar las actualizaciones
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    // Verificar si se encontró la transacción
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    // Enviar la transacción actualizada como respuesta
    return res.status(200).send(transaction);
  } catch (error) {
    // ERRORES
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Borrar la transacción deseada por su id
 * @param {string} id - ID de la transacción
 * 
 */
transactionRouter.delete("/transactions/:id", (req, res) => {
  // Obtenemos el ID de la transacción de los parámetros de la URL
  const transactionId = req.params.id;

  // Usamos Transaction para buscar y eliminar la transacción.
  Transaction.findByIdAndDelete(transactionId)
    .then((transaction) => {
      if (!transaction) {
        res.status(404).send("Transaction not found");
      } else {
        res.status(200).send(transaction);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

/**
 * Getter de todas las transacciones
 * @returns {TransactionDocumentInterface[]} - Todas las transacciones
 * 
 */
transactionRouter.get("/transactions", async (req, res) => {
  try {
    // Obtenemos todas las transacciones de la base de datos
    const transactions = await Transaction.find();

    // Verificamos si se encontraron transacciones
    if (transactions.length === 0) {
      return res.status(404).send("No transactions found");
    }

    // Enviamos las transacciones como respuesta
    return res.status(200).send(transactions);
  } catch (error) {
    // ERRORES
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Getter de la transacción por su id
 * @param {string} id - ID de la transacción
 * @returns {TransactionDocumentInterface} - Transacción deseada
 * 
 */
transactionRouter.get("/transactions/:id", (req, res) => {
  // Obtenemos el ID de la transacción de los parámetros de la URL
  const transactionId = req.params.id;

  // Usamos Transaction para buscar la transacción por su ID
  Transaction.findById(transactionId)
    .populate("items")
    .populate("client")
    .populate("company")
    .exec()
    .then((transaction) => {
      if (!transaction) {
        res.status(404).send("Transaction not found");
      } else {
        res.status(200).send(transaction);
      }
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
