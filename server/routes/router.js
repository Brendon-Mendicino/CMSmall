import { Router } from "express";
import Page from "../dao/pageDao.js";
import User from "../dao/userDao.js";
import crypto from "crypto";
import UserModel from "../models/userModel.js";
import passport from "passport";
import dayjs from "dayjs";
import UserSession from "../entities/userSession.js";
import Content from "../dao/contentDao.js";

const router = Router();

const isAuthN = (req, res, next) => {
  if (req.isAuthenticated()) next();

  res.status(404).json();
};

router.get("/api/pages", async (req, res) => {
  try {
    const isAuth = req.user ? true : false;

    let pages = await Page.getPages();

    if (!isAuth) {
      pages = pages.filter((p) => {
        if (p.publicationState === "published") return true;

        // if (p.publicationState === "scheduled")
        //   return (
        //     now.isBefore(dayjs(p.publicationDate), "date") ||
        //     now.isSame(dayjs(p.publicationDate), "date")
        //   );

        return false;
      });
    }

    // sort pages by publication date
    pages.sort((a, b) => {
      if (!a.publicationDate) return 1;
      if (!b.publicationDate) return -1;
      return dayjs(b.publicationDate).diff(dayjs(a.publicationDate));
    });

    res.status(200).json(pages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/pages/:pageId/contents", async (req, res) => {
  try {
    const isAuth = req.user ? true : false;

    const contents = await Content.getOrdered(req.params.pageId);

    res.status(200).json(contents.map((c) => c.mapToSend()));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/login", passport.authenticate("local"), async (req, res) => {
  if (!req.user) return res.status(400).json();

  res.status(201).json({ ...req.user });
});

router.delete("/api/login", async (req, res) => {
  req.logout((err) => {
    if (err) return res.status(400).json(err);

    return res.status(200).json();
  });
});

export default router;
