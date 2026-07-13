import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scanRouter from "./scan";
import threatsRouter from "./threats";
import reportsRouter from "./reports";
import guardiansRouter from "./guardians";
import aiRouter from "./ai";
import daoRouter from "./dao";
import poolRouter from "./pool";
import developersRouter from "./developers";
import publicV1Router from "./publicV1";
import telegramRouter from "./telegram";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scanRouter);
router.use(threatsRouter);
router.use(reportsRouter);
router.use(guardiansRouter);
router.use(aiRouter);
router.use(daoRouter);
router.use(poolRouter);
router.use(developersRouter);
router.use(telegramRouter);
router.use("/v1", publicV1Router);

export default router;
