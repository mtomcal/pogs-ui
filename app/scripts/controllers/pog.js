'use strict';

angular.module('pogsUiApp')
  .controller('PogCtrl', function ($scope, $routeParams, Pog, Domains, BlastDomains, Predotar, Targetp, Prednls, Ppdb, Nucpred) {
    $scope.loadedBlast = false;
    $scope.loadedOrtho = false;
    $scope.loadedGroup = false;


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
          $scope.orgdata.push(datum);
        });
      });
      $scope.loadedGroup = true;
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

    $scope.prednls = Prednls.query({id: $routeParams.id});
    $scope.nucpred = Nucpred.query({id: $routeParams.id});
    $scope.predotar = Predotar.query({id: $routeParams.id});
    $scope.targetp = Targetp.query({id: $routeParams.id});
    $scope.ppdb = Ppdb.query({id: $routeParams.id});
  });
