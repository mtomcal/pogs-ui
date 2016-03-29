angular.module('pogsUiApp').
    factory('Search', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/search.jsonp', 
                   {
                     page: '@page', 
                     gene: '@gene',
                     tid: '@tid',
                     domain: '@domain',
                     pog: '@pog',
                     type: '@type',
                     targetop: '@targetop',
                     nucop: '@nucop',
                     location: '@location',
                     ppdb: '@ppdb',
                     pogMethod: '@pogMethod',
                     alt:'json', 
                     callback:'JSON_CALLBACK'
                   }, {
    query: {method:'JSONP', query: {}, cache: false}
  });
});

