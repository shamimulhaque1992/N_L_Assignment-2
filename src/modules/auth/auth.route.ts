import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.logIn);
router.post("/refresh-token", authController.refreshToken);

export const authRoute = router;
