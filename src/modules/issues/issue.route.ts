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
router.get("/:id", issueController.getIssue);
router.get("/", issueController.getIssues);
router.patch(
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
