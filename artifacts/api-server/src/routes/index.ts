import { Router, type IRouter } from "express";
import healthRouter from "./health";
import beautyRouter from "./beauty";

const router: IRouter = Router();

router.use(healthRouter);
router.use(beautyRouter);

export default router;
