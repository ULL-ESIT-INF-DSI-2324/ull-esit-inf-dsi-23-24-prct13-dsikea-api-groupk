import { Document, Schema, model } from "mongoose";
import validator from "validator"

export interface CustomerDocumentInterface extends Document {
  name: string;
  surname: string;
  telephoneNumber: string;
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
    lowercase: true
  },
  surname: {
    type: String,
    required: true,
    lowercase: true
  },
  telephoneNumber: {
    type: String,
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
    validate: (value: string) => {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error("Email format is not valid");
      }
    },
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    lowercase: true
  },
  postalCode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true
  },
  gender: {
    type: String,
    validate: (value: string) => {
      return ["male", "female", "other"].includes(value.toLowerCase()); 
    },
    lowercase: true
  },
  nif: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[0-9]{8}[a-zA-Z]/)) {
        throw new Error("Invalid Nif");
      }
      else if (!validator.isAlphanumeric(value)) {
        throw new Error("Only Alphanumeric characters are allowed");
      }
    }
  },
});

export const Customer = model<CustomerDocumentInterface>(
  "Customer",
  CustomerSchema,
);
