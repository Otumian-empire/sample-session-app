// code from netninja
$(document).ready(function() {

  $('#sign')

  $('form').on('submit', function() {

      var item = $('form input');
      var todo = { item: item.val() };

      $.ajax({
          type: 'POST',
          url: '/',
          data: todo,
          success: function(data) {
              //do something with the data via front-end framework
              $('form input').val('')
              location.reload();
          }
      });

      return false;

  });

  $('li').on('click', function() {
    var item_id = $(this).attr('id')

    $.ajax({
      type: 'DELETE',
      url: '/',
      data: { id: item_id },
      success: function(data) {
        //do something with the data via front-end framework
        location.reload();
      }
  });

  });

});
