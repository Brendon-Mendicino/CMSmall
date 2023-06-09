"use strict";

import express from "express";
import router from "./routes/router.js";
import morgan from "morgan";
import cors from "cors";
import crypto from "crypto";
import passport, { strategies } from "passport";
import { Strategy } from "passport-local";
import User from "./dao/userDao.js";
import { KEY_LEN } from "./constants.js";

// init express
const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan("dev"));

// Enable Cross Origin With SessionId exchange
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Setup authentication and local strategy
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.getUser(username);

      if (!user) done(null, false);

      const salt = Buffer.from(user.salt, "hex");
      crypto.scrypt(password, salt, KEY_LEN, (err, derivedKey) => {
        if (err) done(err);

        if (crypto.timingSafeEqual(derivedKey.toString("hex"), user.hash))
          done(null, user);
        else done(null, false, { message: "Wrong user or password" });
      });
    } catch (error) {
      done(error);
    }
  })
);

app.use(router);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
