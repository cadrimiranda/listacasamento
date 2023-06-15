import { ServiceHandler } from "@/src/service";

export default async function handler(req: any, res: any) {
  const serviceHandler = new ServiceHandler();
  await serviceHandler.handleRequest(req, res);
}
