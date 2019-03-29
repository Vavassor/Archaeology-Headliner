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
    const base = "https://waypoint.vice.com/en_us";
    axios
      .get(base)
      .then((siteResponse) => {
        const $ = cheerio.load(siteResponse.data);

        $(".grid__wrapper__card").each((i, element) => {
          const card = $(element);

          const link = new URL(card.attr("href"), base);

          const article = {
            title: card.find(".grid__wrapper__card__text__title").text(),
            summary: card.find(".grid__wrapper__card__text__summary").text(),
            link: link.href,
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
            .catch(error => handleError(error));
        });

        response.send("Scrape completed.");
      })
      .catch(error => handleError(error));
  });

  app.patch("/api/article/:id", (request, response) => {
    const update = request.body;

    models.Article
      .findByIdAndUpdate(request.params.id, update)
      .then(article => response.json(article))
      .catch(error => handleError(error));
  });
};