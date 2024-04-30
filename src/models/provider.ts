import { Document, Schema, model } from "mongoose"
import validator from "validator"

interface ProviderDocumentInterface extends Document {
  name: string,
  address: string,
  telephoneNumber: string,
  email: string,
  website?: string,
  cif: string
}

const ProviderSchema = new Schema<ProviderDocumentInterface>({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    lowercase: true
  },
  telephoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/)) {
        throw new Error("Telephone number format is not valid");
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error("Email format is not valid");
      }
    },
    lowercase: true
  },
  website: {
    type: String,
  },
  cif: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[a-zA-Z][0-9]{8}/)) {
        throw new Error("Invalid Cif");
      }
      else if (!validator.isAlphanumeric(value)) {
        throw new Error("Only Alphanumeric characters are allowed");
      }
    }
  }
});

export const Provider = model<ProviderDocumentInterface>("Provider", ProviderSchema);