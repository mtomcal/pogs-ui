angular.module('pogsUiApp').
    factory('Align', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/align.jsonp', {id: '@id', dataset: '@dataset', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});

