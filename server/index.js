"use strict";

import express from "express";
import router from "./routes/router.js";
import morgan from "morgan";
import cors from "cors";
import crypto from "crypto";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "./dao/userDao.js";
import { KEY_LEN } from "./constants.js";
import UserSession from "./entities/userSession.js";
import session from "express-session";
import http from "http";

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

      if (!user) return done(null, false);

      const salt = Buffer.from(user.salt, "hex");
      crypto.scrypt(password, salt, KEY_LEN, (err, derivedKey) => {
        if (err) return done(err);

        if (crypto.timingSafeEqual(derivedKey, Buffer.from(user.hash, "hex")))
          done(null, user);
        else done(null, false, { message: "Wrong user or password" });
      });
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, new UserSession(user));
});

passport.deserializeUser(async (user, done) => {
  try {
    // check if user still exist
    const dbUser = await User.getUser(user.email);
    if (!dbUser) return done(null, false);

    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});

app.use(
  session({
    secret: "Super secret secret :)",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

app.use(router);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
// http.createServer(app).listen(port, "192.168.138.36");
