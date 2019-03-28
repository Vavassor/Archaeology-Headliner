"use strict";

module.exports = (app) => {
  app.get("/", (request, response) => {
    response.render(
      "index",
      {
        title: "Headliner",
      }
    );
  });

  app.get("*", (request, response) => {
    response.render("page-not-found");
  });
};