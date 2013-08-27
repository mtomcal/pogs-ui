"use strict";angular.module("pogsUiApp",["ui","ui.bootstrap","ngResource","ngSanitize"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/pog/:id",{templateUrl:"views/pog.html",controller:"PogCtrl"}).when("/mart/:id/:type/:dataset",{templateUrl:"views/mart.html",controller:"MartCtrl"}).when("/search",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/search/:page",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/search/genemodel/:genemodel",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/search/:method/genemodel/:genemodel",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/genesearch",{templateUrl:"views/genesearch.html",controller:"SearchCtrl"}).when("/genesearch/:page",{templateUrl:"views/genesearch.html",controller:"SearchCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/plaza/:id",{templateUrl:"views/plaza.html",controller:"PlazaCtrl"}).when("/blast",{templateUrl:"views/blast.html",controller:"BlastCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("pogsUiApp").constant("BASE_URL","/"),angular.module("pogsUiApp").controller("MainCtrl",["$scope","$location","Params",function(a,b,c){a.pogSearch={},a.pogSearch.subCellBool="",a.$watch("pogSearch.predotar + pogSearch.targetp",function(){var b=function(){return a.pogSearch.predotar&&a.pogSearch.targetp?"either":a.pogSearch.predotar?"predotar":a.pogSearch.targetp?"targetp":""};a.pogSearch.subCellBool=b()}),a.pogSearch.genesearch="",a.$watch("pogSearch.genesearch",function(){var b=function(){return a.pogSearch.genesearch.match(/(\_|\.){1}/)?(a.pogSearch.tid=a.pogSearch.genesearch,a.pogSearch.gene="",void 0):(a.pogSearch.tid="",a.pogSearch.gene=a.pogSearch.genesearch,void 0)};b()}),a.pogSearch.nuclearBool="",a.$watch("pogSearch.nucpred",function(){var b=function(){return a.pogSearch.nucpred?"nucpred":""};a.pogSearch.nuclearBool=b()}),a.pogSearch.predotar=!1,a.pogSearch.targetp=!1,a.$watch("pogSearch.subCellTarget + pogSearch.predotar + pogSearch.targetp",function(){a.pogSearch.predotar||a.pogSearch.targetp||(a.pogSearch.subCellTarget="")}),a.pogSearch.ppdb=!1,a.pogSearch.ppdbTarget="",a.pogSearch.pog="",a.pogSearch.pogMethod="groups",a.geneSearch={},a.geneSearch.subCellBool="",a.geneSearch.nuclearBool="",a.geneSearch.ppdbTarget="",a.geneSearch.pog="",a.reset=function(){a.pogSearch.targetp=a.pogSearch.predotar=a.pogSearch.nucpred=a.pogSearch.predictnls=a.pogSearch.ppdbTarget=a.pogSearch.subCellTarget=a.pogSearch.pog=a.pogSearch.nuclearBool=a.pogSearch.subCellBool="",a.pogSearch.ppdb=!1},a.$watch("pogSearch.ppdb + pogSearch.ppdbTarget",function(){a.pogSearch.ppdb||(a.pogSearch.ppdbTarget="")}),c.clear("pogSearch"),a.pogSearchSubmit=function(){c.set("pogSearch",{gene:a.pogSearch.gene,tid:a.pogSearch.tid,domain:a.pogSearch.domain,pog:a.pogSearch.pog,type:"byPOG",targetop:a.pogSearch.subCellBool,nucop:a.pogSearch.nuclearBool,location:a.pogSearch.subCellTarget,ppdb:a.pogSearch.ppdbTarget,pogMethod:a.pogSearch.pogMethod}),b.path("/search")},c.clear("pogSearch"),a.geneSearchSubmit=function(){c.set("geneSearch",{gene:a.geneSearch.gene,tid:a.geneSearch.tid,domain:a.geneSearch.domain,pog:a.geneSearch.pog,type:"byGene",targetop:a.geneSearch.subCellBool,nucop:a.geneSearch.nuclearBool,location:a.geneSearch.subCellTarget,ppdb:a.geneSearch.ppdbTarget}),b.path("/genesearch")},a.booleanGuidelines="<p>For Boolean Searches: <ul style=\"text-align:left;\"><li>Use 'TERM1 AND TERM2' for AND searches</li><li>A space for OR Searches</li><li>Quotes for exact match searches</li></ul></p>"}]),angular.module("pogsUiApp").controller("PogCtrl",["$scope","$location","$routeParams","$q","BASE_URL","Pog","Domains","BlastDomains","Predotar","Targetp","Prednls","Ppdb","Nucpred","Tree","Plaza","Search",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){window.myscope=a,a.BASE_URL=e,a.plazaResults=[],a.plazaId=0,a.plazaTreeData={},a.loadedBlast=!1,a.loadedOrtho=!1,a.loadedGroup=!1,a.loadedTree=!1,a.genemodels=[],a.id=c.id,a.dataset="blast",a.datatype="fasta",a.flyout=!1,a.specieskey={0:"Zea_mays",1:"Arabidopsis_thaliana",2:"Populus_trichocarpa",3:"Oryza_sativa"},a.speciesprefix=function(a){return"3"==a?"LOC_":""},a.selectOrthoAccession=function(a){var b="";return _.each(a,function(a){var c=a.match(/()(AT[\w|\d]+)(\.+)([\w|\d]+)/);_.isNull(c)||(b=c[2])}),b},a.$root.$broadcast("loadedPogPage"),a.dataSubmit=function(c,d){b.path("/mart/"+a.id+"/"+d+"/"+c)},a.urlmap=function(a){var b="",c={rice:[/()(Os[\w|\d]+\.+[\w|\d]+)()()/,"http://rice.plantbiology.msu.edu/cgi-bin/ORF_infopage.cgi?orf="],poplar:[/()(POPTR\_[\w|\d]+)(\.+)([\w|\d]+)/,"http://www.gramene.org/Populus_trichocarpa/Gene/Summary?g="],arab:[/()(AT[\w|\d]+)(\.+)([\w|\d]+)/,"http://www.arabidopsis.org/servlets/TairObject?type=locus&name="],maize:[/()(GRMZM[\w|\d]+)(\_)([\w|\d]+)/,"http://www.maizesequence.org/Zea_mays/Gene?db=core;g="],acmaize:[/()(AC[\.|\d|_|\w]+)()/,"http://www.maizesequence.org/Zea_mays/Gene?db=core;g="]};return _.each(c,function(c,d){var e=a.match(c[0]);"rice"!=d||_.isNull(e)||(e[2]="LOC_"+e[2]),e&&(b=c[1]+e[2])}),b},a.orgdata=[],a.pog=f.query({id:c.id},function(b){_.each(b.locus,function(b){_.each(b.organismdatum,function(b,c){a.genemodels.push(c),a.orgdata.push(b)})}),a.loadedGroup=!0,a.$broadcast("loadedGroup")});var q=function(b){var c=a.$watch(function(){return 0!=angular.element(b+" area").length},function(){angular.element(b+" area").length>0&&(angular.element(b+" area").qtip({content:function(){return angular.element(this).attr("alt")},position:{my:"top left",at:"bottom right"}}),c())},!0)};a.domains=g.query({id:c.id},function(b){return q(".pog-domains"),a.loadedOrtho=!0,b}),a.blast_domains={},a.loadBlastDomains=function(){0==a.loadedBlast&&(a.blast_domains=h.query({id:c.id},function(){q(".blast-domains"),a.loadedBlast=!0}))},a.$on("loadedGroup",function(){n.query({id:c.id},function(b){a.treeData=b})}),a.fetchPlaza=function(b){p.query({page:"1",gene:"",tid:b,domain:"",pog:"",type:"byPOG",targetop:"",nucop:"",location:"",ppdb:"",pogMethod:"plaza_groups"},function(b){d.defer();var c=Object.keys(b.results);a.plazaId=c[0],o.query({id:c[0]},function(b){var c=[];_.each(b.locus,function(a){c.push(a.genemodel)}),a.plazaResults=angular.copy(c),a.$broadcast("loadedPlazaData")})})},a.$on("loadedPlazaData",function(){n.query({id:a.plazaId,method:"plaza"},function(b){a.plazaTreeData=b})}),a.prednls=k.query({id:c.id}),a.nucpred=m.query({id:c.id}),a.predotar=i.query({id:c.id}),a.targetp=j.query({id:c.id}),a.ppdb=l.query({id:c.id})}]),angular.module("pogsUiApp").controller("MartCtrl",["$scope","$location","$routeParams","Fasta","Align",function(a,b,c,d,e){var f=a.dataset=c.dataset,g=a.type=c.type,h=a.id=c.id;a.loadedFasta=!1,a.loadedAlign=!1,a.loader=!0;var i=function(b){d.query({id:c.id,dataset:b},function(b){a.fasta=[],_.each(b.fasta,function(b){a.fasta.push(">"+b.genemodel+" | "+angular.element.trim(b.desc)+"\n"),a.fasta.push(b.aa_seq+"\n\n")}),a.fasta=a.fasta.join(""),a.loadedFasta=!0,a.loader=!1})},j=function(b){e.query({id:c.id,dataset:b},function(b){a.align=b,a.loadedAlign=!0,a.loader=!1})};a.loadedFasta||"fasta"!=g||i(f),a.loadedAlign||"align"!=g||j(f),a.back=function(){b.path("/pog/"+h)}}]),angular.module("pogsUiApp").controller("SearchCtrl",["$scope","$location","$routeParams","BASE_URL","Params","Search",function(a,b,c,d,e,f){a.BASE_URL=d;var g="pogSearch",h=function(a){if(a.genemodel){var b="groups";g="genemodel","plaza"==a.method&&(b=a.method+"_groups"),e.clear("genemodel"),e.set("genemodel",{tid:a.genemodel,pogMethod:b,type:"byPOG"})}};h(c),a.page=parseInt(c.page)||1,e.page(g,a.page),a.total_pages=0,a.loader=!0,a.loadedResults=!1,a.noResults=!1,a.setPage=function(a,c){b.path("/"+c+"/"+a)},a.pogMethod=function(){return"plaza_groups"==e.get(g).pogMethod?"plaza":"pog"},a.resolveSearch=function(){return f.query(e.get(g),function(c){if(0==c.results.length)return a.loader=!1,a.noResults=!0,void 0;if(1==Object.keys(c.results).length){var d=Object.keys(c.results);return"plaza_groups"==e.get(g).pogMethod?b.path("/plaza/"+d[0]):b.path("/pog/"+d[0]),void 0}return a.loader=!1,a.loadedResults=!0,a.total_pages=Math.ceil(c.count/25),c},function(){a.loader=!1,a.noResults=!0})},a.results=a.resolveSearch()}]),angular.module("pogsUiApp").controller("AboutCtrl",["$scope",function(){}]),angular.module("pogsUiApp").controller("PlazaCtrl",["$scope","$location","$routeParams","Plaza","Tree","BASE_URL",function(a,b,c,d,e,f){a.plazaResults=[],a.plazaTreeData={},a.loadedBlast=!1,a.loadedOrtho=!1,a.loadedGroup=!1,a.loadedTree=!1,a.genemodels=[],a.id=c.id,a.BASE_URL=f,a.$root.$broadcast("loadedPlazaPage"),a.urlmap=function(a){var b="",c={rice:[/()(Os[\w|\d]+\.+[\w|\d]+)()()/,"http://rice.plantbiology.msu.edu/cgi-bin/ORF_infopage.cgi?orf="],poplar:[/()(POPTR\_[\w|\d]+)(\.+)([\w|\d]+)/,"http://www.gramene.org/Populus_trichocarpa/Gene/Summary?g="],arab:[/()(AT[\w|\d]+)(\.+)([\w|\d]+)/,"http://www.arabidopsis.org/servlets/TairObject?type=locus&name="],maize:[/()(GRMZM[\w|\d]+)(\_)([\w|\d]+)/,"http://www.maizesequence.org/Zea_mays/Gene?db=core;g="],acmaize:[/()(AC[\.|\d|_|\w]+)()/,"http://www.maizesequence.org/Zea_mays/Gene?db=core;g="]};return _.each(c,function(c,d){var e=a.match(c[0]);"rice"!=d||_.isNull(e)||(e[2]="LOC_"+e[2]),e&&(b=c[1]+e[2])}),b},a.selectOrthoAccession=function(a){var b="";return _.each(a,function(a){var c=a.locus.match(/AT[\w|\d]+/);_.isNull(c)||(b=a.locus)}),b},a.orgdata=[],a.pog=d.query({id:c.id},function(b){_.each(b.locus,function(b){a.genemodels.push(b.genemodel),a.orgdata.push(b)}),a.loadedGroup=!0,a.$broadcast("loadedGroup")}),a.$on("loadedGroup",function(){e.query({id:a.id,method:"plaza"},function(b){a.plazaTreeData=b})})}]),angular.module("pogsUiApp").controller("QuickSearch",["$scope","$location","Params",function(a,b,c){window.myscope=a,a.pogSearch={},a.pogSearch.genesearch="",a.pogSearch.tid="",a.pogSearch.gene="",a.pogSearch.pogMethod="groups",a.$watch("pogSearch.genesearch",function(){var b=function(){return a.pogSearch.genesearch.match(/(\_|\.){1}/)?(a.pogSearch.tid=a.pogSearch.genesearch,a.pogSearch.gene="",void 0):(a.pogSearch.tid="",a.pogSearch.gene=a.pogSearch.genesearch,void 0)};b()}),a.pogSearchSubmit=function(){c.clear("pogSearch"),c.set("pogSearch",{gene:a.pogSearch.gene,tid:a.pogSearch.tid,type:"byPOG",pogMethod:a.pogSearch.pogMethod}),b.path("/search")}}]),angular.module("pogsUiApp").controller("BlastCtrl",["$scope","Blast",function(a,b){a.isCollapsed=!0,a.showResults=!1,a.loader=!1,a.results,a.blast={method:"blastp",seq:"",matrix:"PAM30",wordSize:"",openGap:"",extendGap:"",threshold:"",gapAlign:!0,dropGap:"",dropUngap:"",EValue:""},a.blastSearch=function(){a.loader=!0,a.showResults=!1,b.query(a.blast,function(b){a.loader=!1,a.showResults=!0,a.results=b.results})}}]),angular.module("pogsUiApp").factory("Pog",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/pog.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Domains",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/domains.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Nucpred",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/nucpred.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Targetp",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/targetp.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Predotar",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/predotar.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Prednls",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/prednls.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Ppdb",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/ppdb.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("BlastDomains",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/blast_domains.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Tree",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/tree.jsonp",{id:"@id",method:"@method",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Align",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/align.jsonp",{id:"@id",dataset:"@dataset",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Search",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/search.jsonp",{page:"@page",gene:"@gene",tid:"@tid",domain:"@domain",pog:"@pog",type:"@type",targetop:"@targetop",nucop:"@nucop",location:"@location",ppdb:"@ppdb",pogMethod:"@pogMethod",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Fasta",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/fasta.jsonp",{id:"@id",dataset:"@dataset",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").service("Params",["$rootScope",function(a){var b={page:"1",gene:"",tid:"",domain:"",pog:"",type:"",targetop:"",nucop:"",location:"",ppdb:"",pogMethod:""},c={},d=function(a){c[a]=_.clone(b)},e=function(a){return a?(a+="",a=a.toLowerCase(),a=a.replace(/([\w|\d]+)\s+or\s+/g,"$1 "),a=a.replace(/not\s+([\w|\d]+)\s*/g,"-$1 "),a=a.replace(/([\w|\d]+)\s+and\s+/g,"+$1 +"),a=a.replace(/([\w|\d]+)(\+|\-)/g,"$1 +"),a=a.replace(/[\']+/g,'"')):""};return{set:function(b,f,g){d(b),_.each(f,function(a,b){"domain"==b&&(a=e(a)),f[b]=a||""}),_.extend(c[b],f),0!=g&&a.$broadcast("Params:set")},get:function(a){return c[a]},page:function(a,b){c[a].page=b},clear:function(a){d(a)}}}]),angular.module("pogsUiApp").factory("Plaza",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/plaza.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Blast",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/blast.jsonp",{method:"@method",seq:"@seq",matrix:"@matrix",wordSize:"@wordSize",openGap:"@openGap",extendGap:"@extendGap",threshold:"@threshold",gapAlign:"@gapAlign",dropGap:"@dropGap",dropUngap:"@dropUngap",EValue:"@EValue",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").controller("FlyoutCtrl",["$scope","$rootScope",function(a,b){window.myscope=b;var c=this,d="webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",e=angular.element(".navbar"),f=angular.element("footer");e.removeClass("no-transition"),e.addClass("out"),f.removeClass("no-transition"),f.addClass("out"),c.activate=function(){e.removeClass("out").addClass("flyout-body"),f.removeClass("out").addClass("flyout-body"),angular.element(".flyout").one(d,function(){var a=b.$on("$locationChangeSuccess",function(){e.addClass("no-transition"),f.addClass("no-transition"),c.deactivate(),a()})})},c.deactivate=function(){e.addClass("out"),f.addClass("out"),angular.element("body").off("click"),angular.element(".flyout").off("click")},c.maximize=function(){e.addClass("extend"),f.addClass("extend"),angular.element(".flyout").one(d,function(){angular.element(".plaza-tree").addClass("extend")}),b.$broadcast("Flyout:overlay:redraw")},c.minimize=function(){e.removeClass("extend"),f.removeClass("extend"),angular.element(".plaza-tree").removeClass("extend"),b.$broadcast("Flyout:redraw")},c.observers={},c.addObs=function(a,b){c.observers[a]=b,b.task={activate:!1,maximize:!1}},c.update=function(a){_.each(c.observers,function(b){b.task=a,b.update()}),a.activate?c.activate():(c.deactivate(),c.minimize()),a.maximize?c.maximize():c.minimize()},b.$on("loadedPlazaPage",function(){c.deactivate(),c.minimize()}),b.$on("loadedPogPage",function(){c.deactivate(),c.minimize()})}]),angular.module("pogsUiApp").directive("flyoutarea",function(){return{restrict:"E",scope:{},controller:"FlyoutCtrl",transclude:!0,template:"<div ng-transclude></div>",link:function(){}}}),angular.module("pogsUiApp").directive("flyoutbody",function(){return{require:"^flyoutarea",restrict:"E",transclude:!0,replace:!0,scope:{},template:'<div class="flyout-body out" ng-transclude></div>',link:function(a,b,c,d){a.task={},d.addObs("body",a),a.update=function(){a.task.activate?b.removeClass("out"):b.addClass("out"),a.task.maximize?b.addClass("extend"):b.removeClass("extend")}}}}),angular.module("pogsUiApp").directive("flyout",["$rootScope",function(){return{require:"^flyoutarea",restrict:"E",transclude:!0,scope:{},template:'<div class="flyout out"><div class="content"><a ng-click="close()" href="">Close</a><div ng-transclude></div><button ng-click="maximize()" class="btn btn-primary btn-mini">Plaza Cladogram</button></div></div>',link:function(a,b,c,d){a.task={},d.addObs("flyout",a),a.maximize=function(){d.update({activate:!0,maximize:!0})},a.update=function(){a.task.activate?b.find(".flyout").removeClass("out"):b.find(".flyout").addClass("out"),a.task.maximize?b.find(".flyout").addClass("extend"):b.find(".flyout").removeClass("extend")},a.close=function(){d.update({activate:!1,maximize:!1})}}}}]),angular.module("pogsUiApp").directive("plazaflyout",function(){return{require:"^flyoutarea",restrict:"E",scope:{style:"@",gene:"@",callback:"&"},transclude:!0,replace:!0,template:'<button id="plazaflyout" class="{{style}}" ng-transclude>Plaza</button>',link:function(a,b,c,d){b.bind("click",function(){d.update({activate:!0,maximize:!1}),a.callback({gene:a.gene})})}}}),angular.module("pogsUiApp").directive("approval",function(){return{restrict:"E",scope:{genemodels:"=",update:"="},controller:["$scope","Params","Search","Plaza",function(a,b,c,d){a.approved=!1,a.unapproved=!1,a.resolve=function(){a.genemodels.length<1||(b.clear("approval"),b.set("approval",{tid:a.genemodels[0],type:"byPOG",pogMethod:"plaza_groups"}),c.query(b.get("approval"),function(b){var c=Object.keys(b.results);d.query({id:c[0]},function(b){var c=_.map(b.locus,function(a){return a.genemodel}),d=_.difference(c,a.genemodels);d.length<1&&c.length==a.genemodels.length?a.approved=!0:a.unapproved=!0})}))},a.$watch("update",function(){a.resolve()})}],template:'<div ng-show="approved" class="approved inline"><h5><i class="icon-ok-sign icon-1x text-success"></i> Predictions are consistent with Plaza</h5></div><div ng-show="unapproved" class="unapproved inline"><h5><i class="icon-ban-circle icon-1x text-error"></i> Predictions are inconsistent with Plaza</h5></div>',link:function(){}}}),angular.module("pogsUiApp").directive("compile",["$compile",function(a){return function(b,c,d){b.$watch(function(a){return a.$eval(d.compile)},function(d){c.html(d),a(c.contents())(b)})}}]),angular.module("pogsUiApp").directive("scrollTo",["$window",function(a){return{restrict:"AC",compile:function(){function b(b){b||a.scrollTo(0,0);var d=c.getElementById(b);d||(d=c.getElementsByName(b),d=d&&d.length?d[0]:null),d&&d.scrollIntoView()}var c=a.document;return function(a,c,d){c.bind("click",function(){b(d.scrollTo)})}}}}]),angular.module("pogsUiApp").directive("treerender",["$rootScope",function(a){return{restrict:"E",scope:{genemodels:"=",tree:"=",url:"=",pogid:"=",divid:"@",color:"@",height:"@",width:"@",dy:"@",padding:"@",method:"@",lazy:"@"},transclude:!0,template:"<small><p>Asterisks (*) mark members of this POG</p></small><div ng-transclude></div>",link:function(b){var c=function(a,c){var d=b.url,e=angular.element(a),f=function(){return e.find("branch_length").each(function(){angular.element(this).text("1")}).promise()},g=function(){return e.find("name").each(function(){if(_.include(b.genemodels,angular.element(this).text())){var a=angular.element(this).text();angular.element(this).text(a+"*")}else{var c="/";"undefined"!=typeof b.method&&(c="/"+b.method+"/");var e=angular.element("<annotation><desc>Click to Search For "+angular.element(this).text()+" POG</desc><uri>"+d+"#/search"+c+"genemodel/"+angular.element(this).text()+"</uri></annotation>");angular.element(this).parent().append(e)}}).promise()};angular.element.when(f(),g()).done(c(e[2].outerHTML))},d=function(a){b.divid==a&&(Smits.PhyloCanvas.Render.Style.line.stroke=b.color,Smits.PhyloCanvas.Render.Style.text.fill=b.color,Smits.PhyloCanvas.Render.Style.text.highlight=b.color,Smits.PhyloCanvas.Render.Style.text["font-size"]=12,"true"==b.lazy&&e())},e=function(){b.padding="undefined"==typeof b.padding?100:parseInt(b.padding),b.genemodels.length>0&&"undefined"!=typeof b.tree[b.pogid]&&c(b.tree[b.pogid],function(a){b.divId="phylo_"+b.divid;var c={phyloxml:a,fileSource:!1};if(angular.element("#phylo_"+b.divid).html(""),angular.element("#phylo_"+b.divid),new Smits.PhyloCanvas(c,"phylo_"+b.divid,parseInt(b.width),parseInt(b.height)),angular.element("#phylo_"+b.divid+"> svg").attr("height",parseInt(b.height)+b.padding),"undefined"!=typeof b.dy)var d=angular.element,e=b.$watch(function(){return 0!=d("tspan").length},function(){angular.element("tspan").attr("dy","5"),e()},!0)})};"true"!=b.lazy&&b.$watch("tree",e),a.$on("Flyout:redraw",function(){d("pog")}),a.$on("Flyout:overlay:redraw",function(){d("plaza")})}}}]);