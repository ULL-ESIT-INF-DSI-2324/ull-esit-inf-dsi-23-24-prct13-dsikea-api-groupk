import { Document, Schema, model } from "mongoose";
import { CustomerDocumentInterface } from "./customer.js";
import { FurnitureDocumentInterface } from "./furniture.js";
import { ProviderDocumentInterface } from "./provider.js";

/**
 * Interfaz que extiende Document y define los datos de una transacción
 * @interface TransactionDocumentInterface
 * @extends {Document}
 * @property {Date} timestamp - Fecha y hora de la transacción
 * @property {number} amount - Monto de la transacción
 * @property {CustomerDocumentInterface} client - Cliente de la transacción
 * @property {ProviderDocumentInterface} company - Compañía de la transacción
 * @property {FurnitureDocumentInterface[]} items - Muebles de la transacción
 * 
 */
interface TransactionDocumentInterface extends Document {
  timestamp: Date;
  amount: number;
  client?: CustomerDocumentInterface;
  company?: ProviderDocumentInterface;
  items: FurnitureDocumentInterface[];
}

/**
 * Schema para las transacciones
 * @const TransactionSchema
 * @type {Schema<TransactionDocumentInterface>}
 * 
 */
const TransactionSchema = new Schema<TransactionDocumentInterface>({
  timestamp: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
  },
  items: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Furniture",
  },
});

TransactionSchema.pre(
  "validate",
  function (this: TransactionDocumentInterface, next) {
    if (!this.client && !this.company) {
      return next(new Error("Debes definir un cliente o una compañía"));
    }
    if (this.client && this.company) {
      return next(
        new Error("Solo puedes definir un cliente o una compañía, no ambos"),
      );
    }
    next();
  },
);

/**
 * Instancia la transacción usando model
 * @const Transaction
 * @type {Model<TransactionDocumentInterface>}
 * 
 */
export const Transaction = model<TransactionDocumentInterface>(
  "Transaction",
  TransactionSchema,
);
