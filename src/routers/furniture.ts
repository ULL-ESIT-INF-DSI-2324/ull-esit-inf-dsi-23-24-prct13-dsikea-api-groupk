import express from "express";
import { Furniture } from "../models/furniture.js";

/**
 * Interfaz para el filtro de búsqueda
 * @interface FilterInterface
 * @property {string} name - Nombre del mueble
 * @property {string} color - Color del mueble
 * @property {{ $regex: string; $options: string }} description - Descripción del mueble
 * 
 */
interface FilterInterface {
  name?: string;
  color?: string;
  description?: { $regex: string; $options: string };
}

export const furnitureRouter = express.Router();

/**
 * Post de mueble
 * @param {string} name - Nombre del mueble
 * @param {string} description - Descripción del mueble
 * @param {string} category - Categoría del mueble
 * @param {string} dimensions - Dimensiones del mueble
 * @param {string[]} materials - Materiales del mueble
 * @param {string} color - Color del mueble
 * @param {string} style - Estilo del mueble
 * @param {number} price - Precio del mueble
 * @param {string} imageUrl - URL de la imagen del mueble
 * @param {number} quantity - Cantidad de muebles
 * 
 */
furnitureRouter.post("/furnitures", (req, res) => {
  const furniture = new Furniture(req.body);
  furniture
    .save()
    .then((furniture) => {
      res.status(201).send(furniture);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

/**
 * Getter de mueble
 * @param {string} name - Nombre del mueble
 * @param {string} color - Color del mueble
 * @param {string} description - Descripción del mueble
 * 
 */
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
    Furniture.findOne(filter)
      .then((furniture) => {
        if (furniture) res.status(200).send(furniture);
        else res.status(404).send("Furniture not found");
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Query params not provided");
  }
});

/**
 * Getter del mueble por su id
 * @param {string} id - ID del mueble
 * 
 */
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

/**
 * Patch del mueble
 * @param {string} name - Nombre del mueble
 * @param {string} color - Color del mueble
 * @param {string} description - Descripción del mueble
 * 
 */
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
      "quantity",
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

/**
 * Patch del cliente con su id
 * @param {string} id - ID del cliente
 * 
 */
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
    "quantity",
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

/**
 * Borrar el mueble deseado
 * @param {string} name - Nombre del mueble
 * @param {string} color - Color del mueble
 * @param {string} description - Descripción del mueble
 */
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

/**
 * Borrar el mueble deseado por su id
 * @param {string} id - ID del mueble
 * 
 */
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
