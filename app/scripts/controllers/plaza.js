'use strict';

angular.module('pogsUiApp')
  .controller('PlazaCtrl', function ($scope, $location, $routeParams, Plaza, Tree, BASE_URL) {
    $scope.plazaResults = [];
    $scope.plazaTreeData = {};
    $scope.loadedBlast = false;
    $scope.loadedOrtho = false;
    $scope.loadedGroup = false;
    $scope.loadedTree = false;
    $scope.genemodels = [];
    $scope.id = $routeParams.id;
    $scope.BASE_URL = BASE_URL;

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
          $scope.plazaTreeData = data;
        });
    });

  });
