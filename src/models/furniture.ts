import { Document, Schema, model } from "mongoose";

/**
 * Interfaz que extiende Document y define los datos de un mueble
 * @interface FurnitureDocumentInterface
 * @extends {Document}
 * @property {string} name - Nombre del mueble
 * @property {string} description - Descripción del mueble
 * @property {string} category - Categoría del mueble
 * @property {string} dimensions - Dimensiones del mueble
 * @property {string[]} materials - Materiales del mueble
 * @property {string} color - Color del mueble
 * @property {string} style - Estilo del mueble
 * @property {number} price - Precio del mueble
 * @property {string} imageUrl - URL de la imagen del mueble
 * @property {number} quantity - Cantidad de muebles
 * 
 */
export interface FurnitureDocumentInterface extends Document {
  name: string;
  description: string;
  category?: string;
  dimensions: string;
  materials?: string[];
  color: string;
  style?: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

/**
 * Schema para los muebles
 * @const FurnitureSchema
 * @type {Schema<FurnitureDocumentInterface>}
 * 
 */
const FurnitureSchema = new Schema<FurnitureDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  dimensions: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^\d+x\d+x\d+/)) {
        throw new Error("Dimensions format not valid");
      }
    },
  },
  materials: {
    type: [String],
  },
  color: {
    type: String,
    required: true,
  },
  style: {
    type: String,
  },
  price: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

/**
 * Instancia el mueble usando model
 * @const Furniture
 * @type {Model<FurnitureDocumentInterface>}
 * 
 */
export const Furniture = model<FurnitureDocumentInterface>(
  "Furniture",
  FurnitureSchema,
);
