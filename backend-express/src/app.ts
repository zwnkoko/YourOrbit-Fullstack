import "tsconfig-paths/register";
import express, { Request, Response } from "express";
import routes from "./routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import cors from "cors";

const app = express();

// Middleware to handle CORS
// This allows requests from specific origins and methods
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware to handle all auth requests
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Middleware
// Body parser
app.use(express.json());

// Routes
app.use("/api", routes);

export default app;
