import { getModels, WishListDocument } from "@/src/schemas";
import Cors from "cors";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import Database from "./db";

enum PIDS {
  add = "add",
  getall = "getall",
  delete = "delete",
  image = "image",
  qrCode = "qrCode",
  refreshModels = "refreshModels",
}

export class ServiceHandler {
  private cors = Cors({
    methods: ["POST", "GET", "HEAD"],
  });

  private runMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise((resolve, reject) => {
      this.cors(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }

        return resolve(result);
      });
    });
  };

  private getJSONBody = (req: NextApiRequest) => {
    return JSON.parse(req.body);
  };

  private getWishItemFromBody = async (req: NextApiRequest) => {
    const models = await getModels();
    const body = JSON.parse(req.body);
    return new models.WishListModel({
      title: body.title,
      value: body.value,
      imageSrc: body.imageSrc,
      qrCode: body.qrCode,
      qrCodeLink: body.qrCodeLink,
    });
  };

  private handleAddOrUpdate = async (
    req: NextApiRequest,
    res: NextApiResponse
  ) => {
    const models = await getModels();
    const body = this.getJSONBody(req);
    const { id } = body;

    try {
      if (id) {
        delete body.id;
        const doc = await models.WishListModel.updateOne(
          { _id: id ?? new mongoose.Types.ObjectId() },
          body
        );
        return res.status(200).json({ doc, operation: "update" });
      }

      const model = await this.getWishItemFromBody(req);
      await model.save();
      res.status(200).json({ doc: model, operation: "add" });
    } catch (error) {
      console.log("add", error);
      res.status(400).json(error);
    }
  };

  private getAll = async (req: NextApiRequest, res: NextApiResponse) => {
    const models = await getModels();

    try {
      const list = await models.WishListModel.find().exec();
      const newList = list.map((x) => ({
        title: x.title,
        value: x.value,
        id: x._id,
      }));
      res.status(200).json(newList);
    } catch (error) {
      console.log("getall", error);
      res.status(400).json([]);
    }
  };

  private getReqId = (req: any) => {
    const { id } = req.query;
    return id;
  };

  private getOne = async (req: any): Promise<WishListDocument | null> => {
    const id = this.getReqId(req);
    const models = await getModels();

    try {
      return models.WishListModel.findById(id).exec();
    } catch (error) {
      return null;
    }
  };

  private deleteItem = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = this.getReqId(req);
    const models = await getModels();

    try {
      await models.WishListModel.deleteOne({ _id: id }).exec();
      res.status(200).json("ok");
    } catch (error) {
      console.log("delete", error);
      res.status(400).json("error");
    }
  };

  private getImage = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const item = await this.getOne(req);
      if (item && item.imageSrc) {
        res.status(200).json(item.imageSrc);
      } else {
        res.status(400).json("");
      }
    } catch (error) {
      console.log("image", error);
      res.status(400).json("");
    }
  };

  private getQrCode = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const item = await this.getOne(req);
      if (item && item.qrCode) {
        res.status(200).json({ image: item.qrCode, link: item.qrCodeLink });
      } else {
        res.status(400).json({});
      }
    } catch (error) {
      console.log("image", error);
      res.status(400).json({});
    }
  };

  public handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const { pid } = req.query;
    await this.runMiddleware(req, res);

    switch (pid) {
      case PIDS.add:
        return this.handleAddOrUpdate(req, res);
      case PIDS.getall:
        return this.getAll(req, res);
      case PIDS.delete:
        return this.deleteItem(req, res);
      case PIDS.image:
        return this.getImage(req, res);
      case PIDS.qrCode:
        return this.getQrCode(req, res);
      case PIDS.refreshModels:
        Database.getInstance().refreshModels();
      default:
        return res.status(200).json("Shit! SHITS MY MAN!");
    }
  };
}
