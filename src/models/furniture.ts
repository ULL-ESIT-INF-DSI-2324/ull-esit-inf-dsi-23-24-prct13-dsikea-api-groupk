import { Document, Schema, model } from "mongoose";

/**
 * Interfaz que extiende Document y define los datos de un mueble
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
  quantity: number
}

/**
 * Schema para los muebles
 */
const FurnitureSchema = new Schema<FurnitureDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true
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
    type: Number
  }
});

/**
 * Instancia el mueble usando model
 */
export const Furniture = model<FurnitureDocumentInterface>(
  "Furniture",
  FurnitureSchema,
);
