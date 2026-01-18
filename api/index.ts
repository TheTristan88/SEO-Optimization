import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes.js";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

let routesRegistered = false;

async function handle(req: Request, res: Response) {
  if (!routesRegistered) {
    await registerRoutes(httpServer, app);
    routesRegistered = true;
  }
  return app(req, res);
}

export default handle;
