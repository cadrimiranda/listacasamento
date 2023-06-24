import { getModels, WishListDocument } from "@/src/schemas";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

enum PIDS {
  add = "add",
  getall = "getall",
  delete = "delete",
  image = "image",
  qrCode = "qrCode",
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

  private getWishItemModel = async (req: NextApiRequest) => {
    const models = await getModels();
    const body = this.getJSONBody(req);
    return new models.WishListModel({
      title: body.title,
      value: body.value,
      imageSrc: body.imageSrc,
      qrCode: body.qrCode,
    });
  };

  private handleAdd = async (req: NextApiRequest, res: NextApiResponse) => {
    const model = await this.getWishItemModel(req);

    try {
      await model.save();
      res.status(200).json(model);
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

  private setQRCode = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = this.getReqId(req);
      const models = await getModels();
      const body = this.getJSONBody(req);

      if (body && id) {
        const doc =
          await models.WishListModel.findOneAndUpdate<WishListDocument>(
            { _id: id },
            { qrCode: body.qrCode },
            { new: true }
          );
        if (doc && doc.qrCode === body.qrCode) {
          return res.status(200).json(doc);
        }
      }
      return res.status(400).json("Item not found");
    } catch (error) {
      console.log("setQRCode", error);
      return res.status(400).json([]);
    }
  };

  private getImage = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const item = await this.getOne(req);
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
      case PIDS.qrCode:
        return this.setQRCode(req, res);
      default:
        return res.status(200).json("Shit! SHITS MY MAN!");
    }
  };
}
