angular.module('pogsUiApp').
    factory('Predotar', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/predotar.jsonp', {id: '@id', ortho: '@ortho', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});

