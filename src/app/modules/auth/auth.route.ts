import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router();
router.post(
  "/signup",
  validateRequest(AuthValidation.userSignInSchema),
  authController.signInUser,
);
router.post(
  "/login",
  validateRequest(AuthValidation.userLoginSchema),
  authController.logInUser,
);
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  authController.resetPassword,
);

export const AuthRoutes = router;
