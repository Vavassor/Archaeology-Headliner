"use strict";

let articleId = null;

$(() => {
  $(".show-notes").click((event) => {
    const button = $(event.currentTarget);
    articleId = button.data("article-id");
    $("#note-modal").modal();
  });

  $("#note-modal").on("show.bs.modal", (event) => {
    $("#note-text").empty();

    const base = "/api/note";
    const searchParams = new URLSearchParams();
    searchParams.set("article", articleId);
    const url = base + "?" + searchParams;

    $.get(url)
      .then((notes) => {
        const notesDivision = $("#notes");
        
        notesDivision.empty();

        for (const note of notes) {
          const noteDivision = $(`<div class="note" data-note-id="${note._id}">`);

          const paragraph = $("<p>").text(note.body);
          noteDivision.append(paragraph);

          const remove = $("<button type=\"button\" class=\"btn btn-danger remove-note\">");
          remove.text("Remove");
          remove.data("article-id", note.article);
          noteDivision.append(remove);

          noteDivision.append("<hr>");
          notesDivision.append(noteDivision);
        }

        $(".remove-note").click((event) => {
          event.preventDefault();

          const note = $(event.currentTarget).closest(".note");
          const id = note.data("note-id");

          $.ajax(
              `/api/note/${id}`,
              {
                method: "DELETE",
              }
            )
            .then((response) => {
              note.remove();
            })
            .catch(error => console.error(error));
        });
      })
      .catch(error => console.error(error));
  });

  $("#add-note-form").submit((event) => {
    event.preventDefault();

    const note = {
      body: $("#note-text").val(),
      article: articleId,
    };

    $.post("/api/note", note)
    .then((response) => {
      location.reload();
    })
    .catch(error => console.error(error));
  });

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