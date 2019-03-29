"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const models = require("../models");

module.exports = (app) => {
  app.delete("/api/article", (request, response) => {
    models.Article
      .deleteMany()
      .then(() => {
        response.status(204).end();
      })
      .catch(error => console.error(error));
  });

  app.get("/api/article", (request, response) => {
    models.Article
      .find()
      .then(articles => response.json(articles))
      .catch(error => response.json(error));
  });

  app.post("/api/article/scrape", (request, response) => {
    axios
      .get("https://waypoint.vice.com/en_us")
      .then((siteResponse) => {
        const $ = cheerio.load(siteResponse.data);

        $(".grid__wrapper__card").each((i, element) => {
          const card = $(element);

          const article = {
            title: card.find(".grid__wrapper__card__text__title").text(),
            summary: card.find(".grid__wrapper__card__text__summary").text(),
            link: card.attr("href"),
          };

          models.Article
            .findOneAndUpdate(
              {
                title: article.title,
              },
              article,
              {
                upsert: true,
              }
            )
            .catch(error => console.error(error));
        });

        response.send("Scrape completed.");
      })
      .catch(error => console.error(error));
  });

  app.patch("/api/article/:id", (request, response) => {
    const update = request.body;

    models.Article
      .findByIdAndUpdate(request.params.id, update)
      .then(article => response.json(article))
      .catch(error => console.error(error));
  });
};