angular.module('pogsUiApp').
    factory('Pog', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/pog.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: false}
  });
});

