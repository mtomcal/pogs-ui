'use strict';

angular.module('pogsUiApp')
  .controller('PogCtrl', function ($scope, $location, $routeParams, $q, BASE_URL, Pog, Domains, BlastDomains, Predotar, Targetp, Prednls, Ppdb, Nucpred, Tree, Plaza, Search) {


    window.myscope = $scope;
    $scope.BASE_URL = BASE_URL;
    $scope.plazaResults = [];
    $scope.plazaId = 0;
    $scope.plazaTreeData = {};
    $scope.loadedBlast = false;
    $scope.loadedOrtho = false;
    $scope.loadedGroup = false;
    $scope.loadedTree = false;
    $scope.genemodels = [];
    $scope.id = $routeParams.id;
    $scope.dataset = 'blast';
    $scope.datatype = 'fasta';
    $scope.flyout = false;

    $scope.$root.$broadcast('loadedPogPage');

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
      
      var unwatch = $scope.$watch(
        function() {
        return angular.element('area').length != 0;
      },
      function () {
        if (angular.element('area').length > 0) {
          angular.element('area').qtip({
            content: function () {
              return angular.element(this).attr('alt');
            },
            position: {
              my: 'top left',
              at: 'bottom right',
            }
          });
          unwatch();
        }

      }, true);
      $scope.loadedOrtho = true;
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

    $scope.$on('loadedGroup', function () {
      Tree.query({id: $routeParams.id}, function(tree) {
        $scope.treeData = tree;
      });
    });



    $scope.fetchPlaza = function (gene) {
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
        var deferred = $q.defer();
        var key = Object.keys(data.results);
        $scope.plazaId = key[0];
        Plaza.query({id: key[0]}, function (plaza) {
          var results = [] 
          _.each(plaza.locus, function(val, key) {
            results.push(val.genemodel);
          });
          $scope.plazaResults = angular.copy(results);
          $scope.$broadcast('loadedPlazaData');
        })
      });
    }

    $scope.$on('loadedPlazaData', function () {
      Tree.query({id: $scope.plazaId, method: 'plaza'}, function (data) {
          $scope.plazaTreeData = data;
        });
    });

    $scope.prednls = Prednls.query({id: $routeParams.id});
    $scope.nucpred = Nucpred.query({id: $routeParams.id});
    $scope.predotar = Predotar.query({id: $routeParams.id});
    $scope.targetp = Targetp.query({id: $routeParams.id});
    $scope.ppdb = Ppdb.query({id: $routeParams.id});

  });
