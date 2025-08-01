import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
const PORT = 5000;

const urlMap = {};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumerics with "-"
    .replace(/^-+|-+$/g, "") // trim leading/trailing "-"
    .substring(0, 30); // limit slug length
}

app.post("/shorten", async (req, res) => {
  const longUrl = req.body.url;
    try {
      new URL(longUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }
  try {
    const { data } = await axios.get(longUrl); // fetch full HTML
    const $ = cheerio.load(data);
    const title = $("title").text() || "link"; // get page title
    const titleSlug = slugify(title);

    const randomPart = crypto.randomBytes(2).toString("hex"); // short random string
    const slug = `${titleSlug}-${randomPart}`;

    urlMap[slug] = longUrl;

    res.json({ shortUrl: `http://localhost:5000/${slug}` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Unable to fetch or parse title" });
  }
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  const longUrl = urlMap[slug];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send("Not Found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
