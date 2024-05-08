import express from "express";
import { Provider } from "../models/provider.js";

export const providerRouter = express.Router();

/**
 * Post de proveedor
 */
providerRouter.post("/providers", (req, res) => {
  const provider = new Provider(req.body);
  provider
    .save()
    .then((provider) => {
      res.status(200).send(provider);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

/**
 * Getter de proveedor
 */
providerRouter.get("/providers", (req, res) => {
  const cif = req.query.cif;
  if (cif) {
    Provider.find({ cif: cif })
      .then((providers) => {
        if (providers.length !== 0) {
          res.status(200).send(providers);
        } else {
          res.status(404).send("Provider not found");
        }
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Cif not provided");
  }
});

/**
 * Getter de proveedor por su id
 */
providerRouter.get("/providers/:id", (req, res) => {
  Provider.findById(req.params.id)
    .then((provider) => {
      if (!provider) res.status(404).send("Provider not found");
      else res.status(200).send(provider);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

/**
 * Patch del proveedor
 */
providerRouter.patch("/providers", (req, res) => {
  const cif = req.query.cif;
  if (cif) {
    const allowedUpdates = [
      "name",
      "address",
      "telephoneNumber",
      "email",
      "website",
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send("Update not permitted");
    } else {
      Provider.findOneAndUpdate({ cif: cif }, req.body, {
        new: true,
        runValidators: true,
      })
        .then((provider) => {
          if (!provider) res.status(404).send("Provider not found");
          else res.status(200).send(provider);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }
  } else res.status(400).send("Cif not provided");
});

/**
 * Patch del proveedor con su id
 */
providerRouter.patch("/providers/:id", (req, res) => {
  const allowedUpdates = [
    "name",
    "address",
    "telephoneNumber",
    "email",
    "website",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidUpdate) {
    res.status(400).send("Update not permitted");
  } else {
    Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((provider) => {
        if (!provider) res.status(404).send("Provider not found");
        else res.status(200).send(provider);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }
});

/**
 * Borrar el proveedor deseado
 */
providerRouter.delete("/providers", (req, res) => {
  const cif = req.query.cif;
  if (cif) {
    Provider.findOneAndDelete({ cif: cif })
      .then((provider) => {
        if (!provider) res.status(404).send("Provider not found");
        else res.status(200).send(provider);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Cif not provided");
  }
});

/**
 * Borrar el proveedor deseado por su id
 */
providerRouter.delete("/providers/:id", (req, res) => {
  Provider.findByIdAndDelete(req.params.id)
    .then((provider) => {
      if (!provider) res.status(404).send("Provider not found");
      else res.status(200).send(provider);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
