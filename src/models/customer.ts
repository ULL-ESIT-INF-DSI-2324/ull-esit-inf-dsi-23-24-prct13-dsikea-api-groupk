import { Document, Schema, model } from "mongoose";

interface CustomerDocumentInterface extends Document {
  name: string;
  surname: string;
  telephoneNumber: number;
  email?: string;
  address: string;
  postalCode: number;
  city: string;
  gender?: string;
  nif: string;
}

const CustomerSchema = new Schema<CustomerDocumentInterface>({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  telephoneNumber: {
    type: Number,
    required: true,
    unique: true,
    validate: (value: string) => {
      // Permite diferentes formatos de número de teléfono
      if (!value.match(/^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/)) {
        throw new Error("Telephone number format is not valid");
      }
    },
  },
  email: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  nif: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[0-9]{8}[a-zA-Z]/)) {
        throw new Error("Invalid Nif");
      }
    }
  },
});

export const Customer = model<CustomerDocumentInterface>(
  "Customer",
  CustomerSchema,
);
