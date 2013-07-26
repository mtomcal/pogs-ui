'use strict';

angular.module('pogsUiApp', ['ui', 'ui.bootstrap', 'ngResource', 'ngSanitize'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/pog/:id', {
        templateUrl: 'views/pog.html',
        controller: 'PogCtrl'
      })
      .when('/mart/:id/:type/:dataset', {
        templateUrl: 'views/mart.html',
        controller: 'MartCtrl'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
      })
      .when('/search/:page', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
      })
      .when('/search/genemodel/:genemodel', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
      })
      .when('/genesearch', {
        templateUrl: 'views/genesearch.html',
        controller: 'SearchCtrl',
      })
      .when('/genesearch/:page', {
        templateUrl: 'views/genesearch.html',
        controller: 'SearchCtrl',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
      })
      .when('/plaza/:id', {
        templateUrl: 'views/plaza.html',
        controller: 'PlazaCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

angular.module('pogsUiApp')
  .controller('MainCtrl', function ($scope, $location, Params) {
    $scope.pogSearch = {};
    $scope.pogSearch.subCellBool = '';

    $scope.$watch('pogSearch.predotar + pogSearch.targetp', function () {
      var resolve = function() {
        if ($scope.pogSearch.predotar && $scope.pogSearch.targetp) {
          return 'either';
        }
        if ($scope.pogSearch.predotar) {
          return 'predotar';
        }
        if ($scope.pogSearch.targetp) {
          return 'targetp';
        }
        return '';
      };
      $scope.pogSearch.subCellBool = resolve();
    });
    $scope.pogSearch.genesearch = '';

    $scope.$watch('pogSearch.genesearch', function() {
      var resolve = function() {
        if ($scope.pogSearch.genesearch.match(/(\_|\.){1}/)) {
          $scope.pogSearch.tid = $scope.pogSearch.genesearch;
          $scope.pogSearch.gene = '';
          return;
        }
        $scope.pogSearch.tid = '';
        $scope.pogSearch.gene = $scope.pogSearch.genesearch;
      };
      resolve();
    });

    $scope.pogSearch.nuclearBool = '';

    $scope.$watch('pogSearch.nucpred + pogSearch.predictnls', function() {
      var resolve = function () {
        if ($scope.pogSearch.nucpred && $scope.pogSearch.predictnls) {
          return 'either';
        }
        if ($scope.pogSearch.nucpred) {
          return 'nucpred';
        }
        if ($scope.pogSearch.predictnls) {
          return 'predictnls';
        }
        return '';
      }
      $scope.pogSearch.nuclearBool = resolve();
    });
    $scope.pogSearch.predotar = false;
    $scope.pogSearch.targetp = false;

    $scope.$watch('pogSearch.subCellTarget + pogSearch.predotar + pogSearch.targetp', function() {
      if ($scope.pogSearch.predotar || $scope.pogSearch.targetp) {
        return;
      }
      $scope.pogSearch.subCellTarget = '';
    });
    
    $scope.pogSearch.ppdb = false;
    $scope.pogSearch.ppdbTarget = '';
    $scope.pogSearch.pog = '';
    $scope.pogSearch.pogMethod = 'groups';

    $scope.geneSearch = {};
    $scope.geneSearch.subCellBool = '';
    $scope.geneSearch.nuclearBool = '';
    $scope.geneSearch.ppdbTarget = '';
    $scope.geneSearch.pog = '';

    $scope.reset = function () {
      $scope.pogSearch.targetp = 
      $scope.pogSearch.predotar = 
      $scope.pogSearch.nucpred = 
      $scope.pogSearch.predictnls = 
      $scope.pogSearch.ppdbTarget = 
      $scope.pogSearch.subCellTarget = 
      $scope.pogSearch.pog = 
      $scope.pogSearch.nuclearBool =
      $scope.pogSearch.subCellBool = '';
      $scope.pogSearch.ppdb = false;
    }

    $scope.$watch('pogSearch.ppdb + pogSearch.ppdbTarget', function() {
      if ($scope.pogSearch.ppdb) {
        return;
      }
      $scope.pogSearch.ppdbTarget = '';
    });

    $scope.pogSearchSubmit = function() {
      Params.clear();
      Params.set({
        gene: $scope.pogSearch.gene,
        tid: $scope.pogSearch.tid,
        domain: $scope.pogSearch.domain,
        pog: $scope.pogSearch.pog,
        type: 'byPOG',
        targetop: $scope.pogSearch.subCellBool,
        nucop: $scope.pogSearch.nuclearBool,
        location: $scope.pogSearch.subCellTarget,
        ppdb: $scope.pogSearch.ppdbTarget,
        pogMethod: $scope.pogSearch.pogMethod
      });

      $location.path('/search');
    }
    $scope.geneSearchSubmit = function() {
      Params.clear();
      Params.set({
        gene: $scope.geneSearch.gene,
        tid: $scope.geneSearch.tid,
        domain: $scope.geneSearch.domain,
        pog: $scope.geneSearch.pog,
        type: 'byGene',
        targetop: $scope.geneSearch.subCellBool,
        nucop: $scope.geneSearch.nuclearBool,
        location: $scope.geneSearch.subCellTarget,
        ppdb: $scope.geneSearch.ppdbTarget,
      });

      $location.path('/genesearch');
    }

    $scope.booleanGuidelines = "<p>For Boolean Searches: <ul style=\"text-align:left;\"><li>Use '+TERM1 +TERM2' for AND searches</li><li>A space for OR Searches</li><li>Quotes for exact match searches</li></ul></p>";


  });

'use strict';

angular.module('pogsUiApp')
  .controller('PogCtrl', function ($scope, $location, $routeParams, Pog, Domains, BlastDomains, Predotar, Targetp, Prednls, Ppdb, Nucpred, Tree, Plaza, Search) {

    $scope.loadedBlast = false;
    $scope.loadedOrtho = false;
    $scope.loadedGroup = false;
    $scope.loadedTree = false;
    $scope.genemodels = [];
    $scope.id = $routeParams.id;
    $scope.dataset = 'blast';
    $scope.datatype = 'fasta';
    $scope.flyout = false;

    $scope.dataSubmit = function (dataset, datatype) {
      $location.path('/mart/' + $scope.id + '/' + datatype + '/' + dataset);
    };

    $scope.urlmap = function(genemodel) {
      var _link = "";

      var _regs = {
        rice: [/()(Os[\w|\d]+\.+[\w|\d]+)()()/, 'http://rice.plantbiology.msu.edu/cgi-bin/ORF_infopage.cgi?orf='],
        poplar: [/()(POPTR\_[\w|\d]+)(\.+)([\w|\d]+)/, 'http://www.gramene.org/Populus_trichocarpa/Gene/Summary?g='],
        arab: [/()(AT[\w|\d]+)(\.+)([\w|\d]+)/, 'http://www.arabidopsis.org/servlets/TairObject?type=locus&name='],
        maize: [/()(GRMZM[\w|\d]+)(\_)([\w|\d]+)/, 'http://www.maizesequence.org/Zea_mays/Gene?db=core;g='],
        acmaize: [/()(AC[\.|\d|_|\w]+)()/, 'http://www.maizesequence.org/Zea_mays/Gene?db=core;g='],
      };

      _.each(_regs, function(val, key) {
        var _matches = genemodel.match(val[0]);
        if (key == 'rice' && !_.isNull(_matches)) _matches[2] = 'LOC_' + _matches[2];
        if (_matches) {
          _link = val[1] + _matches[2];
        }
      });
      return _link;
      
    }


    $scope.orgdata = [];
    $scope.pog = Pog.query({id: $routeParams.id}, function (data) {
      _.each(data["locus"], function(profile, id) {
        _.each(profile.organismdatum, function(datum, genemodel) {
          $scope.genemodels.push(genemodel);
          $scope.orgdata.push(datum);
        });
      });
      $scope.loadedGroup = true;
      $scope.$broadcast('loadedGroup');
    });

    $scope.domains = Domains.query({id: $routeParams.id}, function (data) {
      $scope.loadedOrtho = true;
      WZ_Tooltip();
      return data;
    });

    $scope.blast_domains = {};

    
  
    $scope.loadBlastDomains = function () {
      if ($scope.loadedBlast == false) {
        $scope.blast_domains = BlastDomains.query({id: $routeParams.id}, function () {
          $scope.loadedBlast = true;
        });
      }
    };

    var processTree = function (tree, cb) {
      var urlBase = "/ui/";
      var $xml = angular.element(tree);
      if (!$scope.loadedGroup) {
        cb(false);
        return;
      }
      var changeLength = function () {
        return $xml.find('branch_length').each(function() {
          angular.element(this).text('1');
        }).promise();
      }
      var changeAnnotation = function() {
        return $xml.find('name').each(function() {
          if (_.include($scope.genemodels, angular.element(this).text())) {
            var old_value = angular.element(this).text();
            angular.element(this).text(old_value + "*");
          } else {
            var addition = angular.element('<annotation><desc>Click to Search For ' + angular.element(this).text() + ' POG</desc><uri>'+ urlBase +'#/search/genemodel/' + angular.element(this).text() + '</uri></annotation>');
            angular.element(this).parent().append(addition);
          }
        }).promise();
      }
      angular.element
      .when(changeLength(), changeAnnotation())
      .done(cb($xml[2].outerHTML));
    }

    $scope.loadTree = function(tree) {
      processTree(tree[$routeParams.id], function (tree){
        var dataObject = {
          phyloxml: tree,
          fileSource: false 
        }
        angular.element('#svgCanvas').html("");
        new Smits.PhyloCanvas(dataObject,'svgCanvas',1000,1000);
        angular.element('#svgCanvas > svg').attr('height', '1100');
      });
    };


    $scope.$on('loadedGroup', function () {
      Tree.query({id: $routeParams.id}, function(tree) {
        $scope.loadTree(tree);
      });
    });

    $scope.plazaResults = [];
    $scope.plazaId = 0;

    $scope.fetchPlaza = function (gene) {
      console.log(gene)
      var search = Search.query({
        page: '1', 
        gene: '',
        tid: gene,
        domain: '',
        pog: '',
        type: 'byPOG',
        targetop: '',
        nucop: '',
        location: '',
        ppdb: '',
        pogMethod: 'plaza_groups',
      }, function(data) {
        var key = Object.keys(data.results);
        $scope.plazaId = key[0];
        Plaza.query({id: key[0]}, function (plaza) {
          $scope.plazaResults = plaza.locus;
        });
      });

    }

    $scope.prednls = Prednls.query({id: $routeParams.id});
    $scope.nucpred = Nucpred.query({id: $routeParams.id});
    $scope.predotar = Predotar.query({id: $routeParams.id});
    $scope.targetp = Targetp.query({id: $routeParams.id});
    $scope.ppdb = Ppdb.query({id: $routeParams.id});

  });

'use strict';

angular.module('pogsUiApp')
.controller('MartCtrl', function ($scope, $location, $routeParams, Fasta, Align) {

  var dataset = $scope.dataset = $routeParams.dataset;
  var type = $scope.type = $routeParams.type;
  var id = $scope.id = $routeParams.id;

  $scope.loadedFasta = false;
  $scope.loadedAlign = false;
  $scope.loader = true;

  var loadFasta = function (dataset) {
    Fasta.query({id: $routeParams.id, dataset: dataset}, function (data) {
      $scope.fasta = [];
      _.each(data.fasta, function (value) {
        $scope.fasta.push(">" + value.genemodel + " | " + angular.element.trim(value.desc) + "\n");
        $scope.fasta.push(value.aa_seq + "\n\n");
      });
      $scope.fasta = $scope.fasta.join("");
      $scope.loadedFasta = true;
      $scope.loader = false;
    });
  }

  var loadAlign = function (dataset) {
    Align.query({id: $routeParams.id, dataset: dataset}, function (data) {
      $scope.align = data;
      $scope.loadedAlign = true;
      $scope.loader = false;
    });
  };

  if (!$scope.loadedFasta && type == 'fasta') {
    loadFasta(dataset);
  }

  if (!$scope.loadedAlign && type == 'align') {
    loadAlign(dataset);
  }
  $scope.back = function () {
    $location.path('/pog/' + id);
  }
});


'use strict';

angular.module('pogsUiApp')
  .controller('SearchCtrl', function ($scope, $location, $routeParams, Params, Search) {


    $scope.$root.$on('Params:set', function () {
      $scope.results = $scope.resolveSearch();
    });

    var genemodel = function ($routeParams) {
      if (!$routeParams.genemodel) {
        return;
      }
      Params.clear();
      Params.set({
        tid: $routeParams.genemodel,
        method: 'groups',
        type: 'byPOG',
      });
    }

    genemodel($routeParams);

    $scope.page = parseInt($routeParams.page) || 1; 
    Params.page($scope.page);
    $scope.total_pages = 0; 
    $scope.loader = true;
    $scope.loadedResults = false;
    $scope.noResults = false;
    $scope.setPage = function (page, url) {
      $location.path('/'+url+'/'+page);
    };
    $scope.pogMethod = function () {
      if (Params.get().pogMethod == 'plaza_groups') {
        return 'plaza'
      }
      return 'pog'
    };

    $scope.resolveSearch = function () {
      return Search.query(Params.get(), function (data) {
        if (data.results.length == 0) {
          $scope.loader = false;
          $scope.noResults = true;
          return;
        }
        if (Object.keys(data.results).length == 1) {
          var keys = Object.keys(data.results);
          if (Params.get().pogMethod == 'plaza_groups') {
            $location.path('/plaza/'+keys[0]);
          } else {
            $location.path('/pog/'+keys[0]);
          }
          return;
        }
        $scope.loader = false;
        $scope.loadedResults = true;
        $scope.total_pages = Math.ceil(data.count / 25);
        return data;
      }, 
      function (fail) {
        $scope.loader = false;
        $scope.noResults = true;
        return;
      });
    };

    $scope.results = $scope.resolveSearch();
  });

'use strict';

angular.module('pogsUiApp')
.controller('AboutCtrl', function ($scope) {

});


'use strict';

angular.module('pogsUiApp')
  .controller('PlazaCtrl', function ($scope, $location, $routeParams, Plaza) {

    $scope.loadedBlast = false;
    $scope.loadedOrtho = false;
    $scope.loadedGroup = false;
    $scope.loadedTree = false;
    $scope.genemodels = [];
    $scope.id = $routeParams.id;

    $scope.urlmap = function(genemodel) {
      var _link = "";

      var _regs = {
        rice: [/()(Os[\w|\d]+\.+[\w|\d]+)()()/, 'http://rice.plantbiology.msu.edu/cgi-bin/ORF_infopage.cgi?orf='],
        poplar: [/()(POPTR\_[\w|\d]+)(\.+)([\w|\d]+)/, 'http://www.gramene.org/Populus_trichocarpa/Gene/Summary?g='],
        arab: [/()(AT[\w|\d]+)(\.+)([\w|\d]+)/, 'http://www.arabidopsis.org/servlets/TairObject?type=locus&name='],
        maize: [/()(GRMZM[\w|\d]+)(\_)([\w|\d]+)/, 'http://www.maizesequence.org/Zea_mays/Gene?db=core;g='],
        acmaize: [/()(AC[\.|\d|_|\w]+)()/, 'http://www.maizesequence.org/Zea_mays/Gene?db=core;g='],
      };

      _.each(_regs, function(val, key) {
        var _matches = genemodel.match(val[0]);
        if (key == 'rice' && !_.isNull(_matches)) _matches[2] = 'LOC_' + _matches[2];
        if (_matches) {
          _link = val[1] + _matches[2];
        }
      });
      return _link;
      
    }


    $scope.orgdata = [];
    $scope.pog = Plaza.query({id: $routeParams.id}, function (data) {
      _.each(data["locus"], function(profile, id) {
          $scope.genemodels.push(profile.genemodel);
          $scope.orgdata.push(profile);
        });
      $scope.loadedGroup = true;
      $scope.$broadcast('loadedGroup');
    });

  });

'use strict';

angular.module('pogsUiApp')
  .controller('QuickSearch', function ($scope, $location, Params) {

    window.myscope = $scope;
    $scope.pogSearch = {};

    $scope.pogSearch.genesearch = '';
    $scope.pogSearch.tid = '';
    $scope.pogSearch.gene = '';
    $scope.pogSearch.pogMethod = 'groups';


    $scope.$watch('pogSearch.genesearch', function() {
      var resolve = function() {
        if ($scope.pogSearch.genesearch.match(/(\_|\.){1}/)) {
          $scope.pogSearch.tid = $scope.pogSearch.genesearch;
          $scope.pogSearch.gene = '';
          return;
        }
        $scope.pogSearch.tid = '';
        $scope.pogSearch.gene = $scope.pogSearch.genesearch;
      };
      resolve();
    });

    $scope.pogSearchSubmit = function() {
      Params.clear();
      Params.set({
        gene: $scope.pogSearch.gene,
        tid: $scope.pogSearch.tid,
        type: 'byPOG',
        pogMethod: $scope.pogSearch.pogMethod
      });
      $location.path('/search');
    }
  });

angular.module('pogsUiApp').
    factory('Pog', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/pog.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Domains', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/domains.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Nucpred', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/nucpred.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Targetp', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/targetp.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Predotar', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/predotar.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Prednls', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/prednls.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Ppdb', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/ppdb.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', isArray: true, query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('BlastDomains', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/blast_domains.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Tree', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/tree.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Align', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/align.jsonp', {id: '@id', dataset: '@dataset', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});


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
    query: {method:'JSONP', query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    factory('Fasta', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/fasta.jsonp', {id: '@id', dataset: '@dataset', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});


angular.module('pogsUiApp').
    service('Params', function($rootScope){
    var default_params = {
      page: '1', 
      gene: '',
      tid: '',
      domain: '',
      pog: '',
      type: '',
      targetop: '',
      nucop: '',
      location: '',
      ppdb: '',
      pogMethod: '',
    };
    var params = _.clone(default_params);
    var clear = function () {
      params = _.clone(default_params);
    };
    return {
      set: function (value) {
        clear();
        _.each(value, function (val, key) {
          value[key] = val || '';
        });
        _.extend(params, value);
        $rootScope.$broadcast('Params:set');
      },
      get: function () {
        return params;
      },
      page: function (page) {
        params.page = page;
      },
      clear: function () {
        clear();
      }
    };
});

angular.module('pogsUiApp').
    factory('Plaza', function($resource){
  return $resource('http://cas-pogs.uoregon.edu/dev/api/plaza.jsonp', {id: '@id', alt:'json', callback:'JSON_CALLBACK'}, {
    query: {method:'JSONP', query: {}, cache: true}
  });
});


/* This notice must be untouched at all times.

wz_tooltip.js    v. 3.42

The latest version is available at
http://www.walterzorn.com
or http://www.devira.com
or http://www.walterzorn.de

Copyright (c) 2002-2005 Walter Zorn. All rights reserved.
Created 1. 12. 2002 by Walter Zorn (Web: http://www.walterzorn.com )
Last modified: 8. 11. 2006

Cross-browser tooltips working even in Opera 5 and 6,
as well as in NN 4, Gecko-Browsers, IE4+, Opera 7+ and Konqueror.
No onmouseouts required.
Appearance of tooltips can be individually configured
via commands within the onmouseovers.

LICENSE: LGPL

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License (LGPL) as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

For more details on the GNU Lesser General Public License,
see http://www.gnu.org/copyleft/lesser.html
*/
var WZ_Tooltip = function () {
var config=new Object();var tt_Debug=true
var tt_Enabled=true
var TagsToTip=true
config.Above=false
config.BgColor='#E2E7FF'
config.BgImg=''
config.BorderColor='#003099'
config.BorderStyle='solid'
config.BorderWidth=1
config.CenterMouse=false
config.ClickClose=false
config.ClickSticky=false
config.CloseBtn=false
config.CloseBtnColors=['#990000','#FFFFFF','#DD3333','#FFFFFF']
config.CloseBtnText='&nbsp;X&nbsp;'
config.CopyContent=true
config.Delay=400
config.Duration=0
config.Exclusive=false
config.FadeIn=100
config.FadeOut=100
config.FadeInterval=30
config.Fix=null
config.FollowMouse=true
config.FontColor='#000044'
config.FontFace='Verdana,Geneva,sans-serif'
config.FontSize='8pt'
config.FontWeight='normal'
config.Height=0
config.JumpHorz=false
config.JumpVert=true
config.Left=false
config.OffsetX=14
config.OffsetY=8
config.Opacity=100
config.Padding=3
config.Shadow=false
config.ShadowColor='#C0C0C0'
config.ShadowWidth=5
config.Sticky=false
config.TextAlign='left'
config.Title=''
config.TitleAlign='left'
config.TitleBgColor=''
config.TitleFontColor='#FFFFFF'
config.TitleFontFace=''
config.TitleFontSize=''
config.TitlePadding=2
config.Width=0
function Tip()
{tt_Tip(arguments,null);}
function TagToTip()
{var t2t=tt_GetElt(arguments[0]);if(t2t)
tt_Tip(arguments,t2t);}
function UnTip()
{tt_OpReHref();if(tt_aV[DURATION]<0&&(tt_iState&0x2))
tt_tDurt.Timer("tt_HideInit()",-tt_aV[DURATION],true);else if(!(tt_aV[STICKY]&&(tt_iState&0x2)))
tt_HideInit();}
var tt_aElt=new Array(10),tt_aV=new Array(),tt_sContent,tt_t2t,tt_t2tDad,tt_musX,tt_musY,tt_over,tt_x,tt_y,tt_w,tt_h;function tt_Extension()
{tt_ExtCmdEnum();tt_aExt[tt_aExt.length]=this;return this;}
function tt_SetTipPos(x,y)
{var css=tt_aElt[0].style;tt_x=x;tt_y=y;css.left=x+"px";css.top=y+"px";if(tt_ie56)
{var ifrm=tt_aElt[tt_aElt.length-1];if(ifrm)
{ifrm.style.left=css.left;ifrm.style.top=css.top;}}}
function tt_HideInit()
{if(tt_iState)
{tt_ExtCallFncs(0,"HideInit");tt_iState&=~(0x4|0x8);if(tt_flagOpa&&tt_aV[FADEOUT])
{tt_tFade.EndTimer();if(tt_opa)
{var n=Math.round(tt_aV[FADEOUT]/(tt_aV[FADEINTERVAL]*(tt_aV[OPACITY]/tt_opa)));tt_Fade(tt_opa,tt_opa,0,n);return;}}
tt_tHide.Timer("tt_Hide();",1,false);}}
function tt_Hide()
{if(tt_db&&tt_iState)
{tt_OpReHref();if(tt_iState&0x2)
{tt_aElt[0].style.visibility="hidden";tt_ExtCallFncs(0,"Hide");}
tt_tShow.EndTimer();tt_tHide.EndTimer();tt_tDurt.EndTimer();tt_tFade.EndTimer();if(!tt_op&&!tt_ie)
{tt_tWaitMov.EndTimer();tt_bWait=false;}
if(tt_aV[CLICKCLOSE]||tt_aV[CLICKSTICKY])
tt_RemEvtFnc(document,"mouseup",tt_OnLClick);tt_ExtCallFncs(0,"Kill");if(tt_t2t&&!tt_aV[COPYCONTENT])
tt_UnEl2Tip();tt_iState=0;tt_over=null;tt_ResetMainDiv();if(tt_aElt[tt_aElt.length-1])
tt_aElt[tt_aElt.length-1].style.display="none";}}
function tt_GetElt(id)
{return(document.getElementById?document.getElementById(id):document.all?document.all[id]:null);}
function tt_GetDivW(el)
{return(el?(el.offsetWidth||el.style.pixelWidth||0):0);}
function tt_GetDivH(el)
{return(el?(el.offsetHeight||el.style.pixelHeight||0):0);}
function tt_GetScrollX()
{return(window.pageXOffset||(tt_db?(tt_db.scrollLeft||0):0));}
function tt_GetScrollY()
{return(window.pageYOffset||(tt_db?(tt_db.scrollTop||0):0));}
function tt_GetClientW()
{return tt_GetWndCliSiz("Width");}
function tt_GetClientH()
{return tt_GetWndCliSiz("Height");}
function tt_GetEvtX(e)
{return(e?((typeof(e.pageX)!=tt_u)?e.pageX:(e.clientX+tt_GetScrollX())):0);}
function tt_GetEvtY(e)
{return(e?((typeof(e.pageY)!=tt_u)?e.pageY:(e.clientY+tt_GetScrollY())):0);}
function tt_AddEvtFnc(el,sEvt,PFnc)
{if(el)
{if(el.addEventListener)
el.addEventListener(sEvt,PFnc,false);else
el.attachEvent("on"+sEvt,PFnc);}}
function tt_RemEvtFnc(el,sEvt,PFnc)
{if(el)
{if(el.removeEventListener)
el.removeEventListener(sEvt,PFnc,false);else
el.detachEvent("on"+sEvt,PFnc);}}
function tt_GetDad(el)
{return(el.parentNode||el.parentElement||el.offsetParent);}
function tt_MovDomNode(el,dadFrom,dadTo)
{if(dadFrom)
dadFrom.removeChild(el);if(dadTo)
dadTo.appendChild(el);}
var tt_aExt=new Array(),tt_db,tt_op,tt_ie,tt_ie56,tt_bBoxOld,tt_body,tt_ovr_,tt_flagOpa,tt_maxPosX,tt_maxPosY,tt_iState=0,tt_opa,tt_bJmpVert,tt_bJmpHorz,tt_elDeHref,tt_tShow=new Number(0),tt_tHide=new Number(0),tt_tDurt=new Number(0),tt_tFade=new Number(0),tt_tWaitMov=new Number(0),tt_bWait=false,tt_u="undefined";function tt_Init()
{tt_MkCmdEnum();if(!tt_Browser()||!tt_MkMainDiv())
return;tt_IsW3cBox();tt_OpaSupport();tt_AddEvtFnc(document,"mousemove",tt_Move);if(TagsToTip||tt_Debug)
tt_SetOnloadFnc();tt_AddEvtFnc(window,"unload",tt_Hide);}
function tt_MkCmdEnum()
{var n=0;for(var i in config)
eval("window."+i.toString().toUpperCase()+" = "+n++);tt_aV.length=n;}
function tt_Browser()
{var n,nv,n6,w3c;n=navigator.userAgent.toLowerCase(),nv=navigator.appVersion;tt_op=(document.defaultView&&typeof(eval("w"+"indow"+"."+"o"+"p"+"er"+"a"))!=tt_u);tt_ie=n.indexOf("msie")!=-1&&document.all&&!tt_op;if(tt_ie)
{var ieOld=(!document.compatMode||document.compatMode=="BackCompat");tt_db=!ieOld?document.documentElement:(document.body||null);if(tt_db)
tt_ie56=parseFloat(nv.substring(nv.indexOf("MSIE")+5))>=5.5&&typeof document.body.style.maxHeight==tt_u;}
else
{tt_db=document.documentElement||document.body||(document.getElementsByTagName?document.getElementsByTagName("body")[0]:null);if(!tt_op)
{n6=document.defaultView&&typeof document.defaultView.getComputedStyle!=tt_u;w3c=!n6&&document.getElementById;}}
tt_body=(document.getElementsByTagName?document.getElementsByTagName("body")[0]:(document.body||null));if(tt_ie||n6||tt_op||w3c)
{if(tt_body&&tt_db)
{if(document.attachEvent||document.addEventListener)
return true;}
else
tt_Err("wz_tooltip.js must be included INSIDE the body section,"
+" immediately after the opening <body> tag.",false);}
tt_db=null;return false;}
function tt_MkMainDiv()
{if(tt_body.insertAdjacentHTML)
tt_body.insertAdjacentHTML("afterBegin",tt_MkMainDivHtm());else if(typeof tt_body.innerHTML!=tt_u&&document.createElement&&tt_body.appendChild)
tt_body.appendChild(tt_MkMainDivDom());if(window.tt_GetMainDivRefs&&tt_GetMainDivRefs())
return true;tt_db=null;return false;}
function tt_MkMainDivHtm()
{return('<div id="WzTtDiV"></div>'+
(tt_ie56?('<iframe id="WzTtIfRm" src="javascript:false" scrolling="no" frameborder="0" style="filter:Alpha(opacity=0);position:absolute;top:0px;left:0px;display:none;"></iframe>'):''));}
function tt_MkMainDivDom()
{var el=document.createElement("div");if(el)
el.id="WzTtDiV";return el;}
function tt_GetMainDivRefs()
{tt_aElt[0]=tt_GetElt("WzTtDiV");if(tt_ie56&&tt_aElt[0])
{tt_aElt[tt_aElt.length-1]=tt_GetElt("WzTtIfRm");if(!tt_aElt[tt_aElt.length-1])
tt_aElt[0]=null;}
if(tt_aElt[0])
{var css=tt_aElt[0].style;css.visibility="hidden";css.position="absolute";css.overflow="hidden";return true;}
return false;}
function tt_ResetMainDiv()
{tt_SetTipPos(0,0);tt_aElt[0].innerHTML="";tt_aElt[0].style.width="0px";tt_h=0;}
function tt_IsW3cBox()
{var css=tt_aElt[0].style;css.padding="10px";css.width="40px";tt_bBoxOld=(tt_GetDivW(tt_aElt[0])==40);css.padding="0px";tt_ResetMainDiv();}
function tt_OpaSupport()
{var css=tt_body.style;tt_flagOpa=(typeof(css.KhtmlOpacity)!=tt_u)?2:(typeof(css.KHTMLOpacity)!=tt_u)?3:(typeof(css.MozOpacity)!=tt_u)?4:(typeof(css.opacity)!=tt_u)?5:(typeof(css.filter)!=tt_u)?1:0;}
function tt_SetOnloadFnc()
{tt_AddEvtFnc(document,"DOMContentLoaded",tt_HideSrcTags);tt_AddEvtFnc(window,"load",tt_HideSrcTags);if(tt_body.attachEvent)
tt_body.attachEvent("onreadystatechange",function(){if(tt_body.readyState=="complete")
tt_HideSrcTags();});if(/WebKit|KHTML/i.test(navigator.userAgent))
{var t=setInterval(function(){if(/loaded|complete/.test(document.readyState))
{clearInterval(t);tt_HideSrcTags();}},10);}}
function tt_HideSrcTags()
{if(!window.tt_HideSrcTags||window.tt_HideSrcTags.done)
return;window.tt_HideSrcTags.done=true;if(!tt_HideSrcTagsRecurs(tt_body))
tt_Err("There are HTML elements to be converted to tooltips.\nIf you"
+" want these HTML elements to be automatically hidden, you"
+" must edit wz_tooltip.js, and set TagsToTip in the global"
+" tooltip configuration to true.",true);}
function tt_HideSrcTagsRecurs(dad)
{var ovr,asT2t;var a=dad.childNodes||dad.children||null;for(var i=a?a.length:0;i;)
{--i;if(!tt_HideSrcTagsRecurs(a[i]))
return false;ovr=a[i].getAttribute?(a[i].getAttribute("onmouseover")||a[i].getAttribute("onclick")):(typeof a[i].onmouseover=="function")?(a[i].onmouseover||a[i].onclick):null;if(ovr)
{asT2t=ovr.toString().match(/TagToTip\s*\(\s*'[^'.]+'\s*[\),]/);if(asT2t&&asT2t.length)
{if(!tt_HideSrcTag(asT2t[0]))
return false;}}}
return true;}
function tt_HideSrcTag(sT2t)
{var id,el;id=sT2t.replace(/.+'([^'.]+)'.+/,"$1");el=tt_GetElt(id);if(el)
{if(tt_Debug&&!TagsToTip)
return false;else
el.style.display="none";}
else
tt_Err("Invalid ID\n'"+id+"'\npassed to TagToTip()."
+" There exists no HTML element with that ID.",true);return true;}
function tt_Tip(arg,t2t)
{if(!tt_db||(tt_iState&0x8))
return;if(tt_iState)
tt_Hide();if(!tt_Enabled)
return;tt_t2t=t2t;if(!tt_ReadCmds(arg))
return;tt_iState=0x1|0x4;tt_AdaptConfig1();tt_MkTipContent(arg);tt_MkTipSubDivs();tt_FormatTip();tt_bJmpVert=false;tt_bJmpHorz=false;tt_maxPosX=tt_GetClientW()+tt_GetScrollX()-tt_w-1;tt_maxPosY=tt_GetClientH()+tt_GetScrollY()-tt_h-1;tt_AdaptConfig2();tt_OverInit();tt_ShowInit();tt_Move();}
function tt_ReadCmds(a)
{var i;i=0;for(var j in config)
tt_aV[i++]=config[j];if(a.length&1)
{for(i=a.length-1;i>0;i-=2)
tt_aV[a[i-1]]=a[i];return true;}
tt_Err("Incorrect call of Tip() or TagToTip().\n"
+"Each command must be followed by a value.",true);return false;}
function tt_AdaptConfig1()
{tt_ExtCallFncs(0,"LoadConfig");if(!tt_aV[TITLEBGCOLOR].length)
tt_aV[TITLEBGCOLOR]=tt_aV[BORDERCOLOR];if(!tt_aV[TITLEFONTCOLOR].length)
tt_aV[TITLEFONTCOLOR]=tt_aV[BGCOLOR];if(!tt_aV[TITLEFONTFACE].length)
tt_aV[TITLEFONTFACE]=tt_aV[FONTFACE];if(!tt_aV[TITLEFONTSIZE].length)
tt_aV[TITLEFONTSIZE]=tt_aV[FONTSIZE];if(tt_aV[CLOSEBTN])
{if(!tt_aV[CLOSEBTNCOLORS])
tt_aV[CLOSEBTNCOLORS]=new Array("","","","");for(var i=4;i;)
{--i;if(!tt_aV[CLOSEBTNCOLORS][i].length)
tt_aV[CLOSEBTNCOLORS][i]=(i&1)?tt_aV[TITLEFONTCOLOR]:tt_aV[TITLEBGCOLOR];}
if(!tt_aV[TITLE].length)
tt_aV[TITLE]=" ";}
if(tt_aV[OPACITY]==100&&typeof tt_aElt[0].style.MozOpacity!=tt_u&&!Array.every)
tt_aV[OPACITY]=99;if(tt_aV[FADEIN]&&tt_flagOpa&&tt_aV[DELAY]>100)
tt_aV[DELAY]=Math.max(tt_aV[DELAY]-tt_aV[FADEIN],100);}
function tt_AdaptConfig2()
{if(tt_aV[CENTERMOUSE])
{tt_aV[OFFSETX]-=((tt_w-(tt_aV[SHADOW]?tt_aV[SHADOWWIDTH]:0))>>1);tt_aV[JUMPHORZ]=false;}}
function tt_MkTipContent(a)
{if(tt_t2t)
{if(tt_aV[COPYCONTENT])
tt_sContent=tt_t2t.innerHTML;else
tt_sContent="";}
else
tt_sContent=a[0];tt_ExtCallFncs(0,"CreateContentString");}
function tt_MkTipSubDivs()
{var sCss='position:relative;margin:0px;padding:0px;border-width:0px;left:0px;top:0px;line-height:normal;width:auto;',sTbTrTd=' cellspacing="0" cellpadding="0" border="0" style="'+sCss+'"><tbody style="'+sCss+'"><tr><td ';tt_aElt[0].style.width=tt_GetClientW()+"px";tt_aElt[0].innerHTML=(''
+(tt_aV[TITLE].length?('<div id="WzTiTl" style="position:relative;z-index:1;">'
+'<table id="WzTiTlTb"'+sTbTrTd+'id="WzTiTlI" style="'+sCss+'">'
+tt_aV[TITLE]
+'</td>'
+(tt_aV[CLOSEBTN]?('<td align="right" style="'+sCss
+'text-align:right;">'
+'<span id="WzClOsE" style="position:relative;left:2px;padding-left:2px;padding-right:2px;'
+'cursor:'+(tt_ie?'hand':'pointer')
+';" onmouseover="tt_OnCloseBtnOver(1)" onmouseout="tt_OnCloseBtnOver(0)" onclick="tt_HideInit()">'
+tt_aV[CLOSEBTNTEXT]
+'</span></td>'):'')
+'</tr></tbody></table></div>'):'')
+'<div id="WzBoDy" style="position:relative;z-index:0;">'
+'<table'+sTbTrTd+'id="WzBoDyI" style="'+sCss+'">'
+tt_sContent
+'</td></tr></tbody></table></div>'
+(tt_aV[SHADOW]?('<div id="WzTtShDwR" style="position:absolute;overflow:hidden;"></div>'
+'<div id="WzTtShDwB" style="position:relative;overflow:hidden;"></div>'):''));tt_GetSubDivRefs();if(tt_t2t&&!tt_aV[COPYCONTENT])
tt_El2Tip();tt_ExtCallFncs(0,"SubDivsCreated");}
function tt_GetSubDivRefs()
{var aId=new Array("WzTiTl","WzTiTlTb","WzTiTlI","WzClOsE","WzBoDy","WzBoDyI","WzTtShDwB","WzTtShDwR");for(var i=aId.length;i;--i)
tt_aElt[i]=tt_GetElt(aId[i-1]);}
function tt_FormatTip()
{var css,w,h,pad=tt_aV[PADDING],padT,wBrd=tt_aV[BORDERWIDTH],iOffY,iOffSh,iAdd=(pad+wBrd)<<1;if(tt_aV[TITLE].length)
{padT=tt_aV[TITLEPADDING];css=tt_aElt[1].style;css.background=tt_aV[TITLEBGCOLOR];css.paddingTop=css.paddingBottom=padT+"px";css.paddingLeft=css.paddingRight=(padT+2)+"px";css=tt_aElt[3].style;css.color=tt_aV[TITLEFONTCOLOR];if(tt_aV[WIDTH]==-1)
css.whiteSpace="nowrap";css.fontFamily=tt_aV[TITLEFONTFACE];css.fontSize=tt_aV[TITLEFONTSIZE];css.fontWeight="bold";css.textAlign=tt_aV[TITLEALIGN];if(tt_aElt[4])
{css=tt_aElt[4].style;css.background=tt_aV[CLOSEBTNCOLORS][0];css.color=tt_aV[CLOSEBTNCOLORS][1];css.fontFamily=tt_aV[TITLEFONTFACE];css.fontSize=tt_aV[TITLEFONTSIZE];css.fontWeight="bold";}
if(tt_aV[WIDTH]>0)
tt_w=tt_aV[WIDTH];else
{tt_w=tt_GetDivW(tt_aElt[3])+tt_GetDivW(tt_aElt[4]);if(tt_aElt[4])
tt_w+=pad;if(tt_aV[WIDTH]<-1&&tt_w>-tt_aV[WIDTH])
tt_w=-tt_aV[WIDTH];}
iOffY=-wBrd;}
else
{tt_w=0;iOffY=0;}
css=tt_aElt[5].style;css.top=iOffY+"px";if(wBrd)
{css.borderColor=tt_aV[BORDERCOLOR];css.borderStyle=tt_aV[BORDERSTYLE];css.borderWidth=wBrd+"px";}
if(tt_aV[BGCOLOR].length)
css.background=tt_aV[BGCOLOR];if(tt_aV[BGIMG].length)
css.backgroundImage="url("+tt_aV[BGIMG]+")";css.padding=pad+"px";css.textAlign=tt_aV[TEXTALIGN];if(tt_aV[HEIGHT])
{css.overflow="auto";if(tt_aV[HEIGHT]>0)
css.height=(tt_aV[HEIGHT]+iAdd)+"px";else
tt_h=iAdd-tt_aV[HEIGHT];}
css=tt_aElt[6].style;css.color=tt_aV[FONTCOLOR];css.fontFamily=tt_aV[FONTFACE];css.fontSize=tt_aV[FONTSIZE];css.fontWeight=tt_aV[FONTWEIGHT];css.textAlign=tt_aV[TEXTALIGN];if(tt_aV[WIDTH]>0)
w=tt_aV[WIDTH];else if(tt_aV[WIDTH]==-1&&tt_w)
w=tt_w;else
{w=tt_GetDivW(tt_aElt[6]);if(tt_aV[WIDTH]<-1&&w>-tt_aV[WIDTH])
w=-tt_aV[WIDTH];}
if(w>tt_w)
tt_w=w;tt_w+=iAdd;if(tt_aV[SHADOW])
{tt_w+=tt_aV[SHADOWWIDTH];iOffSh=Math.floor((tt_aV[SHADOWWIDTH]*4)/3);css=tt_aElt[7].style;css.top=iOffY+"px";css.left=iOffSh+"px";css.width=(tt_w-iOffSh-tt_aV[SHADOWWIDTH])+"px";css.height=tt_aV[SHADOWWIDTH]+"px";css.background=tt_aV[SHADOWCOLOR];css=tt_aElt[8].style;css.top=iOffSh+"px";css.left=(tt_w-tt_aV[SHADOWWIDTH])+"px";css.width=tt_aV[SHADOWWIDTH]+"px";css.background=tt_aV[SHADOWCOLOR];}
else
iOffSh=0;tt_SetTipOpa(tt_aV[FADEIN]?0:tt_aV[OPACITY]);tt_FixSize(iOffY,iOffSh);}
function tt_FixSize(iOffY,iOffSh)
{var wIn,wOut,h,add,pad=tt_aV[PADDING],wBrd=tt_aV[BORDERWIDTH],i;tt_aElt[0].style.width=tt_w+"px";tt_aElt[0].style.pixelWidth=tt_w;wOut=tt_w-((tt_aV[SHADOW])?tt_aV[SHADOWWIDTH]:0);wIn=wOut;if(!tt_bBoxOld)
wIn-=(pad+wBrd)<<1;tt_aElt[5].style.width=wIn+"px";if(tt_aElt[1])
{wIn=wOut-((tt_aV[TITLEPADDING]+2)<<1);if(!tt_bBoxOld)
wOut=wIn;tt_aElt[1].style.width=wOut+"px";tt_aElt[2].style.width=wIn+"px";}
if(tt_h)
{h=tt_GetDivH(tt_aElt[5]);if(h>tt_h)
{if(!tt_bBoxOld)
tt_h-=(pad+wBrd)<<1;tt_aElt[5].style.height=tt_h+"px";}}
tt_h=tt_GetDivH(tt_aElt[0])+iOffY;if(tt_aElt[8])
tt_aElt[8].style.height=(tt_h-iOffSh)+"px";i=tt_aElt.length-1;if(tt_aElt[i])
{tt_aElt[i].style.width=tt_w+"px";tt_aElt[i].style.height=tt_h+"px";}}
function tt_DeAlt(el)
{var aKid;if(el)
{if(el.alt)
el.alt="";if(el.title)
el.title="";aKid=el.childNodes||el.children||null;if(aKid)
{for(var i=aKid.length;i;)
tt_DeAlt(aKid[--i]);}}}
function tt_OpDeHref(el)
{if(!tt_op)
return;if(tt_elDeHref)
tt_OpReHref();while(el)
{if(el.hasAttribute&&el.hasAttribute("href"))
{el.t_href=el.getAttribute("href");el.t_stats=window.status;el.removeAttribute("href");el.style.cursor="hand";tt_AddEvtFnc(el,"mousedown",tt_OpReHref);window.status=el.t_href;tt_elDeHref=el;break;}
el=tt_GetDad(el);}}
function tt_OpReHref()
{if(tt_elDeHref)
{tt_elDeHref.setAttribute("href",tt_elDeHref.t_href);tt_RemEvtFnc(tt_elDeHref,"mousedown",tt_OpReHref);window.status=tt_elDeHref.t_stats;tt_elDeHref=null;}}
function tt_El2Tip()
{var css=tt_t2t.style;tt_t2t.t_cp=css.position;tt_t2t.t_cl=css.left;tt_t2t.t_ct=css.top;tt_t2t.t_cd=css.display;tt_t2tDad=tt_GetDad(tt_t2t);tt_MovDomNode(tt_t2t,tt_t2tDad,tt_aElt[6]);css.display="block";css.position="static";css.left=css.top=css.marginLeft=css.marginTop="0px";}
function tt_UnEl2Tip()
{var css=tt_t2t.style;css.display=tt_t2t.t_cd;tt_MovDomNode(tt_t2t,tt_GetDad(tt_t2t),tt_t2tDad);css.position=tt_t2t.t_cp;css.left=tt_t2t.t_cl;css.top=tt_t2t.t_ct;tt_t2tDad=null;}
function tt_OverInit()
{if(window.event)
tt_over=window.event.target||window.event.srcElement;else
tt_over=tt_ovr_;tt_DeAlt(tt_over);tt_OpDeHref(tt_over);}
function tt_ShowInit()
{tt_tShow.Timer("tt_Show()",tt_aV[DELAY],true);if(tt_aV[CLICKCLOSE]||tt_aV[CLICKSTICKY])
tt_AddEvtFnc(document,"mouseup",tt_OnLClick);}
function tt_Show()
{var css=tt_aElt[0].style;css.zIndex=Math.max((window.dd&&dd.z)?(dd.z+2):0,1010);if(tt_aV[STICKY]||!tt_aV[FOLLOWMOUSE])
tt_iState&=~0x4;if(tt_aV[EXCLUSIVE])
tt_iState|=0x8;if(tt_aV[DURATION]>0)
tt_tDurt.Timer("tt_HideInit()",tt_aV[DURATION],true);tt_ExtCallFncs(0,"Show")
css.visibility="visible";tt_iState|=0x2;if(tt_aV[FADEIN])
tt_Fade(0,0,tt_aV[OPACITY],Math.round(tt_aV[FADEIN]/tt_aV[FADEINTERVAL]));tt_ShowIfrm();}
function tt_ShowIfrm()
{if(tt_ie56)
{var ifrm=tt_aElt[tt_aElt.length-1];if(ifrm)
{var css=ifrm.style;css.zIndex=tt_aElt[0].style.zIndex-1;css.display="block";}}}
function tt_Move(e)
{if(e)
tt_ovr_=e.target||e.srcElement;e=e||window.event;if(e)
{tt_musX=tt_GetEvtX(e);tt_musY=tt_GetEvtY(e);}
if(tt_iState&0x4)
{if(!tt_op&&!tt_ie)
{if(tt_bWait)
return;tt_bWait=true;tt_tWaitMov.Timer("tt_bWait = false;",1,true);}
if(tt_aV[FIX])
{tt_iState&=~0x4;tt_PosFix();}
else if(!tt_ExtCallFncs(e,"MoveBefore"))
tt_SetTipPos(tt_Pos(0),tt_Pos(1));tt_ExtCallFncs([tt_musX,tt_musY],"MoveAfter")}}
function tt_Pos(iDim)
{var iX,bJmpMod,cmdAlt,cmdOff,cx,iMax,iScrl,iMus,bJmp;if(iDim)
{bJmpMod=tt_aV[JUMPVERT];cmdAlt=ABOVE;cmdOff=OFFSETY;cx=tt_h;iMax=tt_maxPosY;iScrl=tt_GetScrollY();iMus=tt_musY;bJmp=tt_bJmpVert;}
else
{bJmpMod=tt_aV[JUMPHORZ];cmdAlt=LEFT;cmdOff=OFFSETX;cx=tt_w;iMax=tt_maxPosX;iScrl=tt_GetScrollX();iMus=tt_musX;bJmp=tt_bJmpHorz;}
if(bJmpMod)
{if(tt_aV[cmdAlt]&&(!bJmp||tt_CalcPosAlt(iDim)>=iScrl+16))
iX=tt_PosAlt(iDim);else if(!tt_aV[cmdAlt]&&bJmp&&tt_CalcPosDef(iDim)>iMax-16)
iX=tt_PosAlt(iDim);else
iX=tt_PosDef(iDim);}
else
{iX=iMus;if(tt_aV[cmdAlt])
iX-=cx+tt_aV[cmdOff]-(tt_aV[SHADOW]?tt_aV[SHADOWWIDTH]:0);else
iX+=tt_aV[cmdOff];}
if(iX>iMax)
iX=bJmpMod?tt_PosAlt(iDim):iMax;if(iX<iScrl)
iX=bJmpMod?tt_PosDef(iDim):iScrl;return iX;}
function tt_PosDef(iDim)
{if(iDim)
tt_bJmpVert=tt_aV[ABOVE];else
tt_bJmpHorz=tt_aV[LEFT];return tt_CalcPosDef(iDim);}
function tt_PosAlt(iDim)
{if(iDim)
tt_bJmpVert=!tt_aV[ABOVE];else
tt_bJmpHorz=!tt_aV[LEFT];return tt_CalcPosAlt(iDim);}
function tt_CalcPosDef(iDim)
{return iDim?(tt_musY+tt_aV[OFFSETY]):(tt_musX+tt_aV[OFFSETX]);}
function tt_CalcPosAlt(iDim)
{var cmdOff=iDim?OFFSETY:OFFSETX;var dx=tt_aV[cmdOff]-(tt_aV[SHADOW]?tt_aV[SHADOWWIDTH]:0);if(tt_aV[cmdOff]>0&&dx<=0)
dx=1;return((iDim?(tt_musY-tt_h):(tt_musX-tt_w))-dx);}
function tt_PosFix()
{var iX,iY;if(typeof(tt_aV[FIX][0])=="number")
{iX=tt_aV[FIX][0];iY=tt_aV[FIX][1];}
else
{if(typeof(tt_aV[FIX][0])=="string")
el=tt_GetElt(tt_aV[FIX][0]);else
el=tt_aV[FIX][0];iX=tt_aV[FIX][1];iY=tt_aV[FIX][2];if(!tt_aV[ABOVE]&&el)
iY+=tt_GetDivH(el);for(;el;el=el.offsetParent)
{iX+=el.offsetLeft||0;iY+=el.offsetTop||0;}}
if(tt_aV[ABOVE])
iY-=tt_h;tt_SetTipPos(iX,iY);}
function tt_Fade(a,now,z,n)
{if(n)
{now+=Math.round((z-now)/n);if((z>a)?(now>=z):(now<=z))
now=z;else
tt_tFade.Timer("tt_Fade("
+a+","+now+","+z+","+(n-1)
+")",tt_aV[FADEINTERVAL],true);}
now?tt_SetTipOpa(now):tt_Hide();}
function tt_SetTipOpa(opa)
{tt_SetOpa(tt_aElt[5],opa);if(tt_aElt[1])
tt_SetOpa(tt_aElt[1],opa);if(tt_aV[SHADOW])
{opa=Math.round(opa*0.8);tt_SetOpa(tt_aElt[7],opa);tt_SetOpa(tt_aElt[8],opa);}}
function tt_OnCloseBtnOver(iOver)
{var css=tt_aElt[4].style;iOver<<=1;css.background=tt_aV[CLOSEBTNCOLORS][iOver];css.color=tt_aV[CLOSEBTNCOLORS][iOver+1];}
function tt_OnLClick(e)
{e=e||window.event;if(!((e.button&&e.button&2)||(e.which&&e.which==3)))
{if(tt_aV[CLICKSTICKY]&&(tt_iState&0x4))
{tt_aV[STICKY]=true;tt_iState&=~0x4;}
else if(tt_aV[CLICKCLOSE])
tt_HideInit();}}
function tt_Int(x)
{var y;return(isNaN(y=parseInt(x))?0:y);}
Number.prototype.Timer=function(s,iT,bUrge)
{if(!this.value||bUrge)
this.value=window.setTimeout(s,iT);}
Number.prototype.EndTimer=function()
{if(this.value)
{window.clearTimeout(this.value);this.value=0;}}
function tt_GetWndCliSiz(s)
{var db,y=window["inner"+s],sC="client"+s,sN="number";if(typeof y==sN)
{var y2;return(((db=document.body)&&typeof(y2=db[sC])==sN&&y2&&y2<=y)?y2:((db=document.documentElement)&&typeof(y2=db[sC])==sN&&y2&&y2<=y)?y2:y);}
return(((db=document.documentElement)&&(y=db[sC]))?y:document.body[sC]);}
function tt_SetOpa(el,opa)
{var css=el.style;tt_opa=opa;if(tt_flagOpa==1)
{if(opa<100)
{if(typeof(el.filtNo)==tt_u)
el.filtNo=css.filter;var bVis=css.visibility!="hidden";css.zoom="100%";if(!bVis)
css.visibility="visible";css.filter="alpha(opacity="+opa+")";if(!bVis)
css.visibility="hidden";}
else if(typeof(el.filtNo)!=tt_u)
css.filter=el.filtNo;}
else
{opa/=100.0;switch(tt_flagOpa)
{case 2:css.KhtmlOpacity=opa;break;case 3:css.KHTMLOpacity=opa;break;case 4:css.MozOpacity=opa;break;case 5:css.opacity=opa;break;}}}
function tt_Err(sErr,bIfDebug)
{if(tt_Debug||!bIfDebug)
alert("Tooltip Script Error Message:\n\n"+sErr);}
function tt_ExtCmdEnum()
{var s;for(var i in config)
{s="window."+i.toString().toUpperCase();if(eval("typeof("+s+") == tt_u"))
{eval(s+" = "+tt_aV.length);tt_aV[tt_aV.length]=null;}}}
function tt_ExtCallFncs(arg,sFnc)
{var b=false;for(var i=tt_aExt.length;i;)
{--i;var fnc=tt_aExt[i]["On"+sFnc];if(fnc&&fnc(arg))
b=true;}
return b;}
tt_Init();
}

angular.module('pogsUiApp').
  controller('FlyoutCtrl', function ($scope) {

  var ctrl = this;

  ctrl.setFlyout = function (scope) {
    $scope.flyout = scope;
  }
  ctrl.setFlyoutBody = function (scope) {
    $scope.flyoutBody = scope;
  }

  ctrl.activate = function () {
    $scope.flyout.toggle(true);
    $scope.flyoutBody.toggle(true);
  };

  ctrl.deactivate = function () {
    $scope.flyout.toggle(false);
    $scope.flyoutBody.toggle(false);
  };


});


angular.module('pogsUiApp').
  directive('flyoutarea', function(){
    return {
      restrict: 'E',
      scope: {},
      controller: 'FlyoutCtrl',
      transclude: true,
      template: '<div ng-transclude></div>',
      link: function (scope, element, attr) {
      },
    };
});

angular.module('pogsUiApp').
  directive('flyoutbody', function(){
    return {
      require: '^flyoutarea',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {},
      controller: function ($scope, $element) {
        $scope.toggle = function (show) {
          if (show) {
            $element.addClass('flyout-body');
            return;
          }
          $element.removeClass('flyout-body');
        }
      },
      template: '<div ng-transclude></div>',
      link: function (scope, element, attr, FlyoutCtrl) {
        FlyoutCtrl.setFlyoutBody(scope);
      },
    };
});

angular.module('pogsUiApp').
  directive('flyout', function(){
    return {
      require: '^flyoutarea',
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function ($scope) {
        $scope.show = false;
        $scope.toggle = function (show) {
          if (show) {
            $scope.show = true;
            $scope.$apply();
            return;
          }
          $scope.show = false;
          //$scope.$apply();
        }
      },
      template: '<div ng-show="show" class="flyout"><div class="content" ng-transclude><a ng-click="close()" href="">Close</a></div></div>',
      link: function (scope, element, attr, FlyoutCtrl) {
        scope.close = function () {
          FlyoutCtrl.deactivate();
        };
        FlyoutCtrl.setFlyout(scope);
      },
    };
});

angular.module('pogsUiApp').
  directive('plazaflyout', function(){
    return {
      require: '^flyoutarea',
      restrict: 'E',
      scope: {
        style: '@',
        gene: '@',
        callback: '&',
      },
      transclude: true,
      replace: true,
      template: '<button class="{{style}}" ng-transclude>Plaza</button>',
      link: function (scope, element, attr, FlyoutCtrl) {

        scope.activate = function () {
          FlyoutCtrl.activate();
        }
        element.bind('click', function () {
          scope.activate();
          scope.callback({gene: scope.gene});
        });
      },
    };
});



angular.module('pogsUiApp').
  directive('approval', function(){
    return {
      restrict: 'E',
      scope: {
        genemodels: '=',
        update: '=',
      },
      controller: function ($scope, Params, Search, Plaza) {
        $scope.approved = false;
        $scope.unapproved = false;
        $scope.resolve = function () {
          if ($scope.genemodels.length < 1) {
            return;
          }
          Params.clear();
          Params.set({
            tid: $scope.genemodels[0],
            type: 'byPOG',
            pogMethod: 'plaza_groups',
          });
          Search.query(Params.get(), function (search) {
            var keys = Object.keys(search.results);
            Plaza.query({id: keys[0]}, function (plaza) {
              var plaza_genes = _.map(plaza.locus, function (val) {
                return val.genemodel
              });
              var diff = _.difference(plaza_genes, $scope.genemodels);

              if (diff.length < 1 && plaza_genes.length == $scope.genemodels.length) {
                $scope.approved = true;
              } else {
                $scope.unapproved = true;
              };
            });
          });
        };

        $scope.$watch('update', function () {
          $scope.resolve();
        });

      },
      template: '<div ng-show="approved" class="approved inline"><h5><i class="icon-ok-sign icon-1x text-success"></i> Predictions are consistent with Plaza</h5></div><div ng-show="unapproved" class="unapproved inline"><h5><i class="icon-ban-circle icon-1x text-error"></i> Predictions are inconsistent with Plaza</h5></div>',
      link: function ($scope, element, attr) {

      },
    };
});


