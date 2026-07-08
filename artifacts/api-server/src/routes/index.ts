import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scanRouter from "./scan";
import threatsRouter from "./threats";
import reportsRouter from "./reports";
import guardiansRouter from "./guardians";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scanRouter);
router.use(threatsRouter);
router.use(reportsRouter);
router.use(guardiansRouter);
router.use(aiRouter);

export default router;
