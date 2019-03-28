"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const models = require("../models");

module.exports = (app) => {
  app.get("/api/article", function(request, response) {
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
            .create(article)
            .catch(error => console.error(error));
        });

        response.send("Scrape complete.");
      })
      .catch(error => console.error(error));
  });
};