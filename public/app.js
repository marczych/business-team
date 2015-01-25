requirejs.config({
   "paths": {
      "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
      "jquery-ui": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min",
      "bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min"
   }
});

require([
   'business-team',
   'main'
],
function(
   bt,
   main
) {
   console.log('done');
});
