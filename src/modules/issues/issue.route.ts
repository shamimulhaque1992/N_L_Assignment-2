import { Router } from "express";
import { issueController } from "./issue.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { APP_ROLE } from "../../type";

const router = Router();

router.post(
  "/",
  authMiddleware(APP_ROLE.maintainer, APP_ROLE.contributor),
  issueController.createIssue,
);
router.get(
  "/:id",
  authMiddleware(APP_ROLE.maintainer, APP_ROLE.contributor),
  issueController.getIssue,
);
router.get(
  "/",
  authMiddleware(APP_ROLE.maintainer, APP_ROLE.contributor),
  issueController.getIssues,
);
router.put(
  "/:id",
  authMiddleware(APP_ROLE.maintainer, APP_ROLE.contributor),
  issueController.updateIssue,
);
router.delete(
  "/:id",
  authMiddleware(APP_ROLE.maintainer),
  issueController.deleteIssue,
);

export const issueRoute = router;
