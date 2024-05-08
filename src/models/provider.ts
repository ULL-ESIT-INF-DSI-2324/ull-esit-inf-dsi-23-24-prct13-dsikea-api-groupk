import { Document, Schema, model } from "mongoose";
import validator from "validator";

/**
 * Interfaz que extiende Document y define los datos de un proveedor
 */
export interface ProviderDocumentInterface extends Document {
  name: string;
  address: string;
  telephoneNumber: string;
  email: string;
  website?: string;
  cif: string;
}

/**
 * Schema para los proveedores
 */
const ProviderSchema = new Schema<ProviderDocumentInterface>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  telephoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/)) {
        throw new Error("Telephone number format is not valid");
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error("Email format is not valid");
      }
    }
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
      } else if (!validator.isAlphanumeric(value)) {
        throw new Error("Only Alphanumeric characters are allowed");
      }
    }
  },
});

/**
 * Instancia el proveedor usando model
 */
export const Provider = model<ProviderDocumentInterface>(
  "Provider",
  ProviderSchema,
);
