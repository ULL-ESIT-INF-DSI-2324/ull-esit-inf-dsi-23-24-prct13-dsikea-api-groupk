import express from "express";
import { Customer } from "../models/customer.js";

export const customerRouter = express.Router();

/**
 * Post de cliente
 */
customerRouter.post("/customers", (req, res) => {
  const customer = new Customer(req.body);
  customer
    .save()
    .then((customer) => {
      res.status(201).send(customer);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

/**
 * Getter de cliente
 */
customerRouter.get("/customers", (req, res) => {
  const nif = req.query.nif;
  if (nif) {
    Customer.findOne({ nif: nif })
      .then((customer) => {
        if (customer) res.status(200).send(customer);
        else res.status(404).send("Customer not found");
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Nif not provided");
  }
});

/**
 * Getter del cliente por su id
 */
customerRouter.get("/customers/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (!customer) res.status(404).send("Customer not found");
      else res.status(200).send(customer);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

/**
 * Patch del cliente
 */
customerRouter.patch("/customers", (req, res) => {
  const nif = req.query.nif;
  if (nif) {
    const allowedUpdates = [
      "name",
      "surname",
      "telephoneNumber",
      "email",
      "address",
      "postalCode",
      "city",
      "gender",
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send("Update not permitted");
    } else {
      Customer.findOneAndUpdate({ nif: nif }, req.body, {
        new: true,
        runValidators: true,
      })
        .then((customer) => {
          if (!customer) res.status(404).send("Customer not found");
          else res.status(200).send(customer);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }
  } else res.status(400).send("Nif not provided");
});

/**
 * Patch del cliente con su id
 */
customerRouter.patch("/customers/:id", (req, res) => {
  const allowedUpdates = [
    "name",
    "surname",
    "telephoneNumber",
    "email",
    "address",
    "postalCode",
    "city",
    "gender",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidUpdate) {
    res.status(400).send("Update not permitted");
  } else {
    Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((customer) => {
        if (!customer) res.status(404).send("Customer not found");
        else res.status(200).send(customer);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }
});

/**
 * Borrar el cliente deseado
 */
customerRouter.delete("/customers", (req, res) => {
  const nif = req.query.nif;
  if (nif) {
    Customer.findOneAndDelete({ nif: nif })
      .then((customer) => {
        if (!customer) res.status(404).send("Customer not found");
        else res.status(200).send(customer);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Nif not provided");
  }
});

/**
 * Borrar el cliente deseado por su id
 */
customerRouter.delete("/customers/:id", (req, res) => {
  Customer.findByIdAndDelete(req.params.id)
    .then((customer) => {
      if (!customer) res.status(404).send("Customer not found");
      else res.status(200).send(customer);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
