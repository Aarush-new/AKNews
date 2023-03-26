import path from 'path';
import fetch from "node-fetch";
import NewsAPI from "newsapi";
import { MongoClient } from "mongodb";
import { fileURLToPath } from 'url';
import express from "express";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newsapi = new NewsAPI("d61c4363b3ac4038bd5a9b0811e9bef2");




// serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// REST endpoint to get news articles
app.get("/news", async (req, res) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=d61c4363b3ac4038bd5a9b0811e9bef2`
    );
    const data = await response.json();
    res.send(data.articles);
  } catch (error) {
    console.log(error);
    res.send([]);
  }
});

// REST endpoint to get list of users from MongoDB
app.get("/users", async (req, res) => {
  try {
    const client = new MongoClient("mongodb://localhost:27017", {
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("news-app");
    const users = await db.collection("users").find().toArray();
    res.json(users);
    await client.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
