import express, { Response, Request, NextFunction } from "express";
import path from "path";
import targetRouter from "./target/target.router";

const router = express.Router();

router.use('/target', targetRouter);

export default router;
