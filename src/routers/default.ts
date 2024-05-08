import express from "express";

/**
 * Router por defecto
 */
export const defaultRouter = express.Router();

defaultRouter.all("*", (_, res) => {
  res.status(501).send();
});
