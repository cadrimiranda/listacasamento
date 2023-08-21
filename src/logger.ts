import { NextApiRequest, NextApiResponse } from "next";
import { getModels } from "./schemas";

export const log = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const models = await getModels();
  const model = new models.Log(body);
  await model.save();

  return res.status(200);
};

export const logger = {
  log,
};
