angular.module('pogsUiApp').
    factory('Plaza', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/plaza.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: false}
  });
});

