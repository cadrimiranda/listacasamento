import { getModels } from "@/src/schemas";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req: any, res: any) {
  const { pid, id } = req.query;
  const models = await getModels();
  await runMiddleware(req, res, cors);

  if (pid === "add") {
    const body = JSON.parse(req.body);
    const newWishItem = new models.WishListModel({
      title: body.title,
      value: body.value,
      imageSrc: body.imageSrc,
      qrCode: body.qrCode,
    });

    return await newWishItem
      .save()
      .then(() => {
        res.status(200).json(newWishItem);
      })
      .catch((error: any) => {
        console.log("add", error);
        res.status(400).json(error);
      });
  } else if (pid === "getall") {
    await models.WishListModel.find()
      .exec()
      .then((list) => {
        const newList = list.map((x) => ({
          title: x.title,
          value: x.value,
          id: x._id,
        }));
        res.status(200).json(newList);
      })
      .catch((error) => {
        console.log("getall", error);
        return res.status(400).json([]);
      });
  } else if (pid === "delete") {
    await models.WishListModel.deleteOne({ _id: id })
      .exec()
      .then(() => {
        res.status(200).json("ok");
      })
      .catch((error) => {
        console.log("delete", error);
        return res.status(400).json("error");
      });
  } else if (pid === "image") {
    await models.WishListModel.findById(id)
      .exec()
      .then((item) => {
        res.status(200).json(item.imageSrc);
      })
      .catch((error) => {
        console.log("getall", error);
        return res.status(400).json([]);
      });
  } else {
    res.status(200).json("Shit! SHITS MY MAN!");
  }
}
