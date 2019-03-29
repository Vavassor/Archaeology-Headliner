"use strict";

$(() => {
  $("#scrape").click((event) => {
    $.post("/api/article/scrape")
      .then(response => location.reload())
      .catch(error => console.error(error));
  });

  $("#clear-articles").click((event) => {
    $.ajax(
        "/api/article",
        {
          method: "DELETE",
        }
      )
      .then(response => location.reload())
      .catch(error => console.error(error));
  });

  $(".save-button").click((event) => {
    const button = $(event.currentTarget);
    const id = button.data("article-id");
    const article = {
      saved: true,
    };
    $.ajax(
        `/api/article/${id}`,
        {
          method: "PATCH",
          data: article,
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch(error => console.error(error));
  });
});