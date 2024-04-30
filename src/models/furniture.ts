import { Document, Schema, model} from "mongoose"

interface FurnitureDocumentInterface extends Document {
  name: string,
  description: string,
  category?: string,
  dimensions: string,
  materials?: string[],
  color: string,
  style?: string,
  price: number,
  imageUrl?: string
}

const FurnitureSchema = new Schema<FurnitureDocumentInterface>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
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
    }
  },
  materials: {
    type: [String],
  },
  color: {
    type: String,
    required: true
  },
  style: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String
  }
});

export const Furniture = model<FurnitureDocumentInterface>("Furniture", FurnitureSchema);