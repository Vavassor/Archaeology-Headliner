"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const models = require("../models");
const URL = require("url").URL;

function handleError(error, response) {
  console.error(error);
  response
    .status(500)
    .end();
}

module.exports = (app) => {
  app.delete("/api/article", (request, response) => {
    models.Article
      .deleteMany()
      .then(() => response.status(204).end())
      .catch(error => handleError(error));
  });

  app.post("/api/article/scrape", (request, response) => {
    axios
      .get("https://www.archaeology.org/news")
      .then((siteResponse) => {
        const $ = cheerio.load(siteResponse.data);

        const articles = [];

        $(".news_intro").each((i, element) => {
          const card = $(element);

          const relativePath = card
            .children("p")
            .first()
            .children("a")
            .attr("href");
          const link = new URL(relativePath, "https://www.archaeology.org");

          const article = {
            title: card.find(".news_title").text(),
            summary: card.find(".news_cont").text(),
            link: link.href,
          };

          articles.push(article);
        });

        return models.Article.bulkWrite(
          articles.map((article) => {
            return {
              updateOne: {
                filter: {
                  title: article.title,
                },
                update: {
                  $set: article,
                },
                upsert: true,
              },
            };
          })
        );
      })
      .then((writeResult) => {
        response.send("Scrape completed.");
      })
      .catch(error => handleError(error));
  });

  app.patch("/api/article/:id", (request, response) => {
    const update = request.body;

    models.Article
      .findByIdAndUpdate(request.params.id, update)
      .then((article) => {
        if (!article) {
          return response.status(404).end();
        }
        response.json(article);
      })
      .catch(error => handleError(error));
  });

  app.get("/api/note", (request, response) => {
    const conditions = {};

    if (request.params.article) {
      conditions.article = request.params.article;
    }

    models.Note
      .find(conditions)
      .then(notes => response.json(notes))
      .catch(error => handleError(error));
  });

  app.post("/api/note", (request, response) => {
    const note = request.body;

    models.Note
      .create(note)
      .then((note) => {
        response.json(note);
      })
      .catch(error => handleError(error));
  });

  app.delete("/api/note/:id", (request, response) => {
    const id = request.params.id;

    models.Note
      .deleteOne({
        "_id": id,
      })
      .then(() => {
        response.status(204).end();
      })
      .catch(error => handleError(error));
  });
};