"use strict";

$(() => {
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