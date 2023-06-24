import mongoose, { Model } from "mongoose";
import Database from "./db";
const { Schema } = mongoose;

export type WishListDocument = {
  title: String;
  value: Number;
  imageSrc: String;
  qrCode: String;
};

export const WishListSchema = new Schema<WishListDocument>({
  title: String,
  value: Number,
  imageSrc: String,
  qrCode: String,
});

export interface Models {
  WishListModel: Model<WishListDocument>;
}

export async function getModels(): Promise<Models> {
  const db = Database.getInstance();
  await db.connect();
  const connection = db.getConnection();

  return {
    WishListModel:
      connection.models.WishList ||
      connection.model("WishList", WishListSchema),
  };
}
