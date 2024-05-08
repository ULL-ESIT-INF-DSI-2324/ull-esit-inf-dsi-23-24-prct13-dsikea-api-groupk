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
}

/**
 * Schema para los muebles
 */
const FurnitureSchema = new Schema<FurnitureDocumentInterface>({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    lowercase: true,
  },
  category: {
    type: String,
    lowercase: true,
  },
  dimensions: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^\d+x\d+x\d+/)) {
        throw new Error("Dimensions format not valid");
      }
    },
    lowercase: true,
  },
  materials: {
    type: [String],
    lowercase: true,
  },
  color: {
    type: String,
    required: true,
    lowercase: true,
  },
  style: {
    type: String,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

/**
 * Instancia el mueble usando model
 */
export const Furniture = model<FurnitureDocumentInterface>(
  "Furniture",
  FurnitureSchema,
);
