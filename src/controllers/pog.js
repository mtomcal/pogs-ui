export default function ($scope, $location, $routeParams, $q, BASE_URL, Pog, Domains, BlastDomains, Predotar, Targetp, Prednls, Ppdb, Nucpred, Tree, Plaza, Search) {

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
    $scope.specieskey = {
      "0": "Zea_mays",
      "1": "Arabidopsis_thaliana",
      "2": "Populus_trichocarpa",
      "3": "Oryza_sativa"
    };
    $scope.speciesprefix = function (organism_id) {
      if (organism_id == "3") {
        return "LOC_";
      }
      return "";
    };

    $scope.selectOrthoAccession = function (orgdata) {
      var output = "";
      _.each(orgdata, function (value) {
        var matches = value.match(/()(AT[\w|\d]+)(\.+)([\w|\d]+)/)
        if (!_.isNull(matches)) {
          output = matches[2];
        }
      });
      return output;
    };
    $scope.$root.$broadcast('loadedPogPage');

    $scope.dataSubmit = function (dataset, datatype, ortho) {
      if (ortho == 'plaza') {

      } else {
        ortho = 'gramene';
      }
      $location.path('/mart/' + $scope.id + '/' + datatype + '/' + dataset + '/' + ortho);
    };

    $scope.urlmap = function(genemodel) {
      var _link = "";

      var _regs = {
        rice: [/()(Os[\w|\d]+\.+[\w|\d]+)()()/, 'http://rice.plantbiology.msu.edu/cgi-bin/ORF_infopage.cgi?orf='],
        poplar: [/()(POPTR\_[\w|\d]+)(\.+)([\w|\d]+)/, 'http://www.gramene.org/Populus_trichocarpa/Gene/Summary?g='],
        arab: [/()(AT[\w|\d]+)(\.+)([\w|\d]+)/, 'http://www.arabidopsis.org/servlets/TairObject?type=locus&name='],
        maize: [/()(GRMZM[\w|\d]+)(\_)([\w|\d]+)/, 'http://ensembl.gramene.org/Zea_mays/Gene/Summary?g='],
        acmaize: [/()(AC[\.|\d|_|\w]+)()/, 'http://ensembl.gramene.org/Zea_mays/Gene/Summary?g='],
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

    $scope.domains = Domains.query({id: $routeParams.id}, function (data) {
      qtipWatcher(".pog-domains");
      $scope.loadedOrtho = true;
      return data;
    });

    $scope.blast_domains = {};


    $scope.loadBlastDomains = function () {
      if ($scope.loadedBlast == false) {
        $scope.blast_domains = BlastDomains.query({id: $routeParams.id}, function () {
          qtipWatcher(".blast-domains");
          $scope.loadedBlast = true;
        });
      }
    };

    $scope.$on('loadedGroup', function () {
      Tree.query({id: $routeParams.id}, function(tree) {
        $scope.treeHeight = $scope.genemodels.length * 80;
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
        pogMethod: 'plaza_groups'
      }, function(data) {
        var deferred = $q.defer();
        var key = Object.keys(data.results);
        $scope.plazaId = key[0];
        Plaza.query({id: key[0]}, function (plaza) {
          var results = [];
          _.each(plaza.locus, function(val, key) {
            results.push(val.genemodel);
          });
          $scope.plazaResults = angular.copy(results);
          $scope.$broadcast('loadedPlazaData');
        })
      });
    };

    $scope.$on('loadedPlazaData', function () {
      Tree.query({id: $scope.plazaId, method: 'plaza'}, function (data) {
          $scope.plazaTreeHeight = $scope.plazaResults.length * 80;
          $scope.plazaTreeData = data;
        });
    });

    $scope.prednls = Prednls.query({id: $routeParams.id});
    $scope.nucpred = Nucpred.query({id: $routeParams.id});
    $scope.predotar = Predotar.query({id: $routeParams.id});
    $scope.targetp = Targetp.query({id: $routeParams.id});
    $scope.ppdb = Ppdb.query({id: $routeParams.id});

  };
