import { Document, Schema, model } from "mongoose";
import validator from "validator";

/**
 * Interfaz que extiende Document y define los datos de un proveedor
 * @interface ProviderDocumentInterface
 * @extends {Document}
 * @property {string} name - Nombre del proveedor
 * @property {string} address - Dirección del proveedor
 * @property {string} telephoneNumber - Número de teléfono del proveedor
 * @property {string} email - Correo electrónico del proveedor
 * @property {string} website - Sitio web del proveedor
 * @property {string} cif - CIF del proveedor
 * 
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
 * @const ProviderSchema
 * @type {Schema<ProviderDocumentInterface>}
 * 
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
    },
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
    },
  },
});

/**
 * Instancia el proveedor usando model
 * @const Provider
 * @type {Model<ProviderDocumentInterface>}
 * 
 */
export const Provider = model<ProviderDocumentInterface>(
  "Provider",
  ProviderSchema,
);
