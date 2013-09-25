angular.module('pogsUiApp').
    factory('Fasta', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/fasta.jsonp', {id: '@id', dataset: '@dataset', ortho: '@ortho', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});

