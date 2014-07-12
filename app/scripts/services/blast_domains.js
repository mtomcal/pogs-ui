angular.module('pogsUiApp').
    factory('BlastDomains', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/api/blast_domains.jsonp', {id: '@id', ortho: '@ortho', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: false}
  });
});

