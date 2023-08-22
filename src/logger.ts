import { NextApiRequest, NextApiResponse } from "next";
import { LogType, getModels } from "./schemas";

export type LogDataDashboard = {
  id: number;
  document: string;
  logType: LogType;
  count: number;
};

export const log = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const models = await getModels();
  const model = new models.Log(body);
  await model.save();

  return res.status(200);
};

export const getDashboard = async (
  req: NextApiRequest,
  res: NextApiResponse<LogDataDashboard[]>
) => {
  const models = await getModels();
  const data = await models.Log.aggregate<{
    _id: { document: string; logType: string };
    count: number;
  }>([
    {
      $group: {
        _id: { document: "$document", logType: "$logType" },
        count: { $sum: 1 },
      },
    },
  ]).exec();

  return res
    .status(200)
    .json(
      data.map(
        (x, i) => ({ id: i, ...x._id, count: x.count } as LogDataDashboard)
      )
    );
};

export const logger = {
  log,
  getDashboard,
};
