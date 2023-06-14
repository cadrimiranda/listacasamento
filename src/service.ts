import { getModels } from "@/src/schemas";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

enum PIDS {
  add = "add",
  getall = "getall",
  delete = "delete",
  image = "image",
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

  private getWishItemFromBody = async (req: NextApiRequest) => {
    const models = await getModels();
    const body = JSON.parse(req.body);
    return new models.WishListModel({
      title: body.title,
      value: body.value,
      imageSrc: body.imageSrc,
      qrCode: body.qrCode,
    });
  };

  private handleAdd = async (req: NextApiRequest, res: NextApiResponse) => {
    const newWishItem = await this.getWishItemFromBody(req);

    try {
      await newWishItem.save();
      res.status(200).json(newWishItem);
    } catch (error) {
      console.log("add", error);
      res.status(400).json(error);
    }
  };

  private getAll = async (req: any, res: any) => {
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

  private deleteItem = async (req: any, res: any) => {
    const { id } = req.query;
    const models = await getModels();

    try {
      await models.WishListModel.deleteOne({ _id: id }).exec();
      res.status(200).json("ok");
    } catch (error) {
      console.log("delete", error);
      res.status(400).json("error");
    }
  };

  private getImage = async (req: any, res: any) => {
    const { id } = req.query;
    const models = await getModels();

    try {
      const item = await models.WishListModel.findById(id).exec();
      if (item && item.imageSrc) {
        res.status(200).json(item.imageSrc);
      } else {
        res.status(400).json([]);
      }
    } catch (error) {
      console.log("image", error);
      res.status(400).json([]);
    }
  };

  public handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const { pid } = req.query;
    await this.runMiddleware(req, res);

    switch (pid) {
      case PIDS.add:
        return this.handleAdd(req, res);
      case PIDS.getall:
        return this.getAll(req, res);
      case PIDS.delete:
        return this.deleteItem(req, res);
      case PIDS.image:
        return this.getImage(req, res);
      default:
        res.status(200).json("Shit! SHITS MY MAN!");
    }
  };
}
