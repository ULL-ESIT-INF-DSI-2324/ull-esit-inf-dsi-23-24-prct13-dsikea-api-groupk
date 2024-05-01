import { Document, Schema, model } from "mongoose"
import { CustomerDocumentInterface } from "./customer.js";
import { FurnitureDocumentInterface } from "./furniture.js";
import { ProviderDocumentInterface } from "./provider.js";


interface TransactionDocumentInterface extends Document {
  timestamp: Date,
  amount: number,
  client?: CustomerDocumentInterface,
  company?: ProviderDocumentInterface,
  items: FurnitureDocumentInterface[]
}

const TransactionSchema = new Schema<TransactionDocumentInterface>({
  timestamp: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Customer"
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Provider"
  },
  items: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Furniture"
  } 
});

TransactionSchema.pre("validate", function(this: TransactionDocumentInterface, next) {
  if (!this.client && !this.company) {
    return next(new Error('Debes definir un cliente o una compañía'));
  }
  if (this.client && this.company) {
    return next(new Error('Solo puedes definir un cliente o una compañía, no ambos'));
  }
  next();
})


export const Transaction = model<TransactionDocumentInterface>("Transaction", TransactionSchema);