import { ServiceHandler } from "@/src/service";

export default async function handler(req: any, res: any) {
  const serviceHandler = new ServiceHandler();
  serviceHandler.handleRequest(req, res);
}
