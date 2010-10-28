$(document).ready(function() {

  $("#build").click(function () {

      $.post('/url',{git_url: $(".git").val(), rake : $(".rake").val()} ,function () {
        alert('success');
      }, "json"
        );
  });
});
