import { Router } from "express";
import { issueController } from "./issue.controller";

const router = Router();

router.post("/:id", issueController.createIssue);
router.get("/:id", issueController.getIssue);
router.get("/", issueController.getIssues);
router.put("/:id", issueController.updateIssue);
router.delete("/:id", issueController.deleteIssue);

export const issueRoute = router;
