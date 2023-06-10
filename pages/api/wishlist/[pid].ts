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
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req: any, res: any) {
  const { pid } = req.query;
  const models = await getModels();
  await runMiddleware(req, res, cors)

  if (pid === "add") {
    const body = JSON.parse(req.body);
    const newWishItem = new models.WishListModel({
      title: body.title,
      value: body.value,
      imageSrc: body.imageSrc,
      qrCode: body.qrCode
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
    models.WishListModel.find()
      .exec()
      .then((list) => {
        res.status(200).json(list);
      })
      .catch((error) => {
        console.log("getall", error);
        return res.status(400).json([]);
      });
  } else if (pid === "delete") {
    const queryParams = req.url.split("?")[1];
    const params = new URLSearchParams(queryParams);
    const paramValue = params.get("name");

    models.WishListModel.deleteOne({ title: paramValue })
      .exec()
      .then(() => {
        res.status(200).json("ok");
      })
      .catch((error) => {
        console.log("delete", error);
        return res.status(400).json("error");
      });
  } else {
    res.status(200).json("Shit! SHITS MY MAN!");
  }
}
