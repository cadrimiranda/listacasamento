import mongoose, { Model } from "mongoose";
import Database from "./db";
const { Schema } = mongoose;

export type WishListDocument = {
  title: String;
  value: Number;
  imageSrc: String;
  qrCode: String;
  qrCodeLink: String;
};

export enum LogType {
  seen = "seen",
  clicked = "clicked",
  filter = "filter",
  ordered = "ordered",
  copyPIX = "copyPIX",
}

export type WishListLog = {
  document?: String;
  filter?: String;
  logType: String;
};

export const LogSchema = new Schema<WishListLog>({
  document: String,
  logType: String,
  filter: String,
});

export const WishListSchema = new Schema<WishListDocument>({
  title: String,
  value: Number,
  imageSrc: String,
  qrCode: String,
  qrCodeLink: String,
});

export interface Models {
  WishListModel: Model<WishListDocument>;
  Log: Model<WishListLog>;
}

export async function getModels(): Promise<Models> {
  const db = Database.getInstance();
  await db.connect();
  const connection = db.getConnection();

  return {
    WishListModel:
      connection.models.WishList ||
      connection.model("WishList", WishListSchema),
    Log: connection.models.Log || connection.model("Log", LogSchema),
  };
}
