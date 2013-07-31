angular.module('pogsUiApp').
    factory('Blast', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/blast.jsonp', 
                   {
                     method: '@method',
                     seq: '@seq',
                     matrix: '@matrix',
                     wordSize: '@wordSize',
                     openGap: '@openGap',
                     extendGap: '@extendGap',
                     threshold: '@threshold',
                     gapAlign: '@gapAlign',
                     dropGap: '@dropGap',
                     dropUngap: '@dropUngap',
                     EValue: '@EValue',
                     alt:'json', 
                     callback:'JSON_CALLBACK'
                   }, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});

