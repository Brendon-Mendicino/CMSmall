import { Router } from "express";
import Page from "../dao/pageDao";

const router = Router();

router.get("/api/pages", async (req, res) => {
  try {
    const pages = await Page.getPages();
    res.status(200).json(pages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
