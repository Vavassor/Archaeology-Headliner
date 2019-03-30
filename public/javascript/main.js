"use strict";

$(() => {
  $("#scrape").click((event) => {
    $.post("/api/article/scrape")
      .then(response => location.href = "/")
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
});