'use strict';

angular.module('pogsUiApp')
  .controller('PlazaCtrl', function ($scope, $location, $routeParams, Plaza, Tree, BASE_URL, $q, Domains, BlastDomains, Predotar, Targetp, Prednls, Ppdb, Nucpred, Search) {
    $scope.plazaResults = [];
    $scope.plazaTreeData = {};
    $scope.loadedBlast = false;
    $scope.loadedOrtho = false;
    $scope.loadedGroup = false;
    $scope.loadedTree = false;
    $scope.genemodels = [];
    $scope.id = $routeParams.id;
    $scope.BASE_URL = BASE_URL;
    $scope.dataset = 'blast';
    $scope.datatype = 'fasta';
    $scope.specieskey = {
      "0": "Zea_mays",
      "1": "Arabidopsis_thaliana",
      "2": "Populus_trichocarpa",
      "3": "Oryza_sativa",
    }

    $scope.$root.$broadcast('loadedPlazaPage');

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

    $scope.selectOrthoAccession = function (orgdata) {
      var output = "";
      _.each(orgdata, function (value) {
        var matches = value.locus.match(/AT[\w|\d]+/)
        if (!_.isNull(matches)) {
          output = value.locus;
        }
      });
      return output;
    };

    $scope.dataSubmit = function (dataset, datatype, ortho) {
      if (ortho == 'plaza') {

      } else {
        ortho = 'gramene';
      }
      $location.path('/mart/' + $scope.id + '/' + datatype + '/' + dataset + '/' + ortho);
    };

    $scope.orgdata = [];
    $scope.pog = Plaza.query({id: $routeParams.id}, function (data) {
      _.each(data["locus"], function(profile, id) {
          $scope.genemodels.push(profile.genemodel);
          $scope.orgdata.push(profile);
        });
      $scope.loadedGroup = true;
      $scope.$broadcast('loadedGroup');
    });


    $scope.$on('loadedGroup', function () {
      Tree.query({id: $scope.id, method: 'plaza'}, function (data) {
        $scope.plazaTreeHeight = $scope.genemodels.length * 80;
          $scope.plazaTreeData = data;
        });
    });

    var qtipWatcher = function (css) {
      var unwatch = $scope.$watch(
        function() {
        return angular.element(css + ' area').length != 0;
      },
      function () {
        if (angular.element(css + ' area').length > 0) {
          angular.element(css + ' area').qtip({
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
    }

    $scope.domains = Domains.query({id: $routeParams.id, ortho: 'plaza'}, function (data) {
      qtipWatcher(".pog-domains");
      $scope.loadedOrtho = true;
      return data;
    });

    $scope.loadBlastDomains = function () {
      if ($scope.loadedBlast == false) {
        $scope.blast_domains = BlastDomains.query({id: $routeParams.id, ortho: 'plaza'}, function () {
          qtipWatcher(".blast-domains");
          $scope.loadedBlast = true;
        });
      }
    };

    $scope.prednls = Prednls.query({id: $routeParams.id, ortho: 'plaza'});
    $scope.nucpred = Nucpred.query({id: $routeParams.id, ortho: 'plaza'});
    $scope.predotar = Predotar.query({id: $routeParams.id, ortho: 'plaza'});
    $scope.targetp = Targetp.query({id: $routeParams.id, ortho: 'plaza'});
    $scope.ppdb = Ppdb.query({id: $routeParams.id, ortho: 'plaza'});

  });
