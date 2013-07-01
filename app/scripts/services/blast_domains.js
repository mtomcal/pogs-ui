angular.module('pogsUiApp').
    factory('BlastDomains', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/blast_domains.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});

