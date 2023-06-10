import mongoose from "mongoose";
import Database from "./db";
const { Schema } = mongoose;

const wishListSchema = new Schema({
  title: String,
  value: Number,
  imageSrc: String,
  qrCode: String,
});

export async function getModels() {
  const db = Database.getInstance();
  await db.connect();
  const connection = db.getConnection();
  
  return {
    WishListModel:
      connection.models.WishList ||
      connection.model("WishList", wishListSchema),
  };
}
