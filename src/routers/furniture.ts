import express from "express";
import { Furniture } from "../models/furniture.js";

interface FilterInterface {
  name?: string;
  color?: string;
  description?: { $regex: string; $options: string };
}

export const furnitureRouter = express.Router();

furnitureRouter.post("/furnitures", (req, res) => {
  const furniture = new Furniture(req.body);
  furniture
    .save()
    .then((furniture) => {
      res.status(200).send(furniture);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

furnitureRouter.get("/furnitures", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    const filter: FilterInterface = {};
    if (req.query.name) filter.name = req.query.name as string;
    if (req.query.color) filter.color = req.query.color as string;
    if (req.query.description)
      filter.description = {
        $regex: req.query.description as string,
        $options: "i",
      };
    Furniture.find(filter)
      .then((furnitures) => {
        if (furnitures.length !== 0) {
          res.status(200).send(furnitures);
        } else {
          res.status(404).send("Furniture not found");
        }
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Query params not provided");
  }
});

furnitureRouter.get("/furnitures/:id", (req, res) => {
  Furniture.findById(req.params.id)
    .then((furniture) => {
      if (!furniture) res.status(404).send("Furniture not found");
      else res.status(200).send(furniture);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

furnitureRouter.patch("/furnitures", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    const filter: FilterInterface = {};
    if (req.query.name) filter.name = req.query.name as string;
    if (req.query.color) filter.color = req.query.color as string;
    if (req.query.description)
      filter.description = {
        $regex: req.query.description as string,
        $options: "i",
      };
    const allowedUpdates = [
      "name",
      "description",
      "category",
      "dimensions",
      "materials",
      "color",
      "style",
      "price",
      "imageUrl",
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send("Update not permitted");
    } else {
      Furniture.findOneAndUpdate(filter, req.body, {
        new: true,
        runValidators: true,
      })
        .then((furniture) => {
          if (!furniture) res.status(404).send("Furniture not found");
          else res.status(200).send(furniture);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }
  } else res.status(400).send("Query params not provided");
});

furnitureRouter.patch("/furnitures/:id", (req, res) => {
  const allowedUpdates = [
    "name",
    "description",
    "category",
    "dimensions",
    "materials",
    "color",
    "style",
    "price",
    "imageUrl",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidUpdate) {
    res.status(400).send("Update not permitted");
  } else {
    Furniture.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((furniture) => {
        if (!furniture) res.status(404).send("Furniture not found");
        else res.status(200).send(furniture);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }
});

furnitureRouter.delete("/furnitures", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    const filter: FilterInterface = {};
    if (req.query.name) filter.name = req.query.name as string;
    if (req.query.color) filter.color = req.query.color as string;
    if (req.query.description)
      filter.description = {
        $regex: req.query.description as string,
        $options: "i",
      };
    Furniture.findOneAndDelete(filter)
      .then((furniture) => {
        if (!furniture) res.status(404).send("Furniture not found");
        else res.status(200).send(furniture);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Query params not provided");
  }
});

furnitureRouter.delete("/furnitures/:id", (req, res) => {
  Furniture.findByIdAndDelete(req.params.id)
    .then((furniture) => {
      if (!furniture) res.status(404).send("furniture not found");
      else res.status(200).send(furniture);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
