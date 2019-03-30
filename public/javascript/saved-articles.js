"use strict";

$(() => {
  $(".remove-button").click((event) => {
    const button = $(event.currentTarget);
    const id = button.data("article-id");
    const article = {
      saved: false,
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
        location.reload();
      })
      .catch(error => console.error(error));
  });
});