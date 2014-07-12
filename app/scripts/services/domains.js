angular.module('pogsUiApp').
    factory('Domains', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/api/domains.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: false}
  });
});

