"use strict";

const models = require("../models");

module.exports = (app) => {
  app.get("/", (request, response) => {
    models.Article
      .find()
      .then((articles) => {
        response.render(
          "index",
          {
            title: "Archaeology Headliner",
            articles: articles,
          }
        );
      })
      .catch(error => console.error(error));
  });

  app.get("/saved-articles", (request, response) => {
    models.Article
      .find({
        saved: true,
      })
      .then((articles) => {
        response.render(
          "saved-articles",
          {
            title: "Saved Articles",
            articles: articles,
          }
        );
      })
      .catch(error => console.error(error));
  });

  app.get("*", (request, response) => {
    response.render(
      "page-not-found",
      {
        title: "Page Not Found"
      }
    );
  });
};