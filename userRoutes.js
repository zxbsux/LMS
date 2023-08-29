import { Router } from "express";
import { getprofile, login, logout, register } from "../controller/userController.js";
import isLoggedIn from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
  const routes=Router();

  routes.post('/register',upload.single("avatar"),register);
  routes.post('/login',login);
  routes.get('/logout',logout);
  routes.get('/me',isLoggedIn,getprofile)

  export default routes;