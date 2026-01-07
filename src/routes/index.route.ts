import type { Application } from "express";
import authRoute from "./auth.route.js";

export default function registerRoutes(app: Application) {
  app.use(authRoute);
}
