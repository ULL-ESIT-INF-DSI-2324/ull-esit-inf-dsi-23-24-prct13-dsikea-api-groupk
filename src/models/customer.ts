import { Document, Schema, model } from "mongoose";
import validator from "validator";

/**
 * Interfaz que extiende Document y define los datos de un cliente
 * @interface CustomerDocumentInterface
 * @extends {Document}
 * @property {string} name - Nombre del cliente
 * @property {string} surname - Apellido del cliente
 * @property {string} telephoneNumber - Número de teléfono del cliente
 * @property {string} email - Correo electrónico del cliente
 * @property {string} address - Dirección del cliente
 * @property {number} postalCode - Código postal del cliente
 * @property {string} city - Ciudad del cliente
 * @property {string} gender - Género del cliente
 * @property {string} nif - NIF del cliente
 * 
 */
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

/**
 * Schema para los clientes
 * @const CustomerSchema
 * @type {Schema<CustomerDocumentInterface>}
 * 
 */
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
    validate: (value: string) => {
      return ["male", "female", "other"].includes(value.toLowerCase());
    },
  },
  nif: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[0-9]{8}[a-zA-Z]/)) {
        throw new Error("Invalid Nif");
      } else if (!validator.isAlphanumeric(value)) {
        throw new Error("Only Alphanumeric characters are allowed");
      }
    },
  },
});

/**
 * Instancia el cliente usando model
 * @const Customer
 * @type {Model<CustomerDocumentInterface>}
 * 
 */
export const Customer = model<CustomerDocumentInterface>(
  "Customer",
  CustomerSchema,
);
