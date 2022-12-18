import express, { Response, Request, NextFunction } from "express";
import targetRouter from "./target/target.router";

// create router
const router = express.Router();

// add router to original router
router.use('/target', targetRouter);

export default router;
