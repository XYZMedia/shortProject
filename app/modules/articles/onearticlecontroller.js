'use strict';

angular.module('newsyApp.controllers.onearticle', ['newsyApp.services.articles'])
  .controller('OneArticleController', ['$scope','$routeParams', '$location', '$modal', '$log', '$sce', 'Articles',
    function($scope, $routeParams, $location, $modal, $log, $sce, Articles) {

      $scope.findArticle = function(){
        Articles.find('5345be07db5b609d098776d9', function(res){
          $scope.article = res;
        });
      };

      $scope.sampleData = function() {
        $scope.sampleData = [
          "A ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          "B ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          "C ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat, sunt in culpa qui officia deserunt mollit anim id est laborum."
        ];
      };

//==========Modal Functionality===========

      //function to open the modal
      $scope.editParagraph = function(currentText) {

        $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          resolve: {
            currentText: function () {
              return currentText;
            },
            items: function () {
              return $scope.sampleData;
            }
          }
        });
      };

    //function to create the modal that gets displayed
    var ModalInstanceCtrl = function ($scope, $modalInstance, currentText, items) {
      
      $scope.modalHeader = 'Current Text:'
      $scope.currentText = currentText;
      $scope.items = items;
      $scope.showEdit = false;
      $scope.newURLs = [0];

      $scope.voteUp = function(){
        console.log('up!')
      }

      $scope.voteDown = function(){
        console.log('down!')
      }

      $scope.newEdit = function(){
        $scope.showEdit = true;
        $scope.modalHeader = "Proposed Edit:";
        $scope.items = []
      }

      $scope.addURL = function(){
        $scope.newURLs.push($scope.newURLs.length)
      }

      $scope.submit = function(){
        $modalInstance.dismiss();
      }

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.getDiff = function(currentText, item){
        return $sce.trustAsHtml(diffString(currentText, item))
      }

//==========Compare Text Functionality===========
//==========Contained within Modal===========
      function escape(s) {
          var n = s;
          n = n.replace(/&/g, "&amp;");
          n = n.replace(/</g, "&lt;");
          n = n.replace(/>/g, "&gt;");
          n = n.replace(/"/g, "&quot;");

          return n;
      }

      function diffString( o, n ) {
        o = o.replace(/\s+$/, '');
        n = n.replace(/\s+$/, '');

        var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
        var str = "";

        var oSpace = o.match(/\s+/g);
        if (oSpace == null) {
          oSpace = ["\n"];
        } else {
          oSpace.push("\n");
        }
        var nSpace = n.match(/\s+/g);
        if (nSpace == null) {
          nSpace = ["\n"];
        } else {
          nSpace.push("\n");
        }

        if (out.n.length == 0) {
            for (var i = 0; i < out.o.length; i++) {
              str += '<del>' + escape(out.o[i]) + oSpace[i] + "</del>";
            }
        } else {
          if (out.n[0].text == null) {
            for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
              str += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
            }
          }

          for ( var i = 0; i < out.n.length; i++ ) {
            if (out.n[i].text == null) {
              str += '<ins>' + escape(out.n[i]) + nSpace[i] + "</ins>";
            } else {
              var pre = "";

              for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
                pre += '<del>' + escape(out.o[n]) + oSpace[n] + "</del>";
              }
              str += " " + out.n[i].text + nSpace[i] + pre;
            }
          }
        }

        return str;
      }

      function diff( o, n ) {
        var ns = new Object();
        var os = new Object();

        for ( var i = 0; i < n.length; i++ ) {
          if ( ns[ n[i] ] == null )
            ns[ n[i] ] = { rows: new Array(), o: null };
          ns[ n[i] ].rows.push( i );
        }

        for ( var i = 0; i < o.length; i++ ) {
          if ( os[ o[i] ] == null )
            os[ o[i] ] = { rows: new Array(), n: null };
          os[ o[i] ].rows.push( i );
        }

        for ( var i in ns ) {
          if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
            n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
            o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
          }
        }

        for ( var i = 0; i < n.length - 1; i++ ) {
          if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null &&
               n[i+1] == o[ n[i].row + 1 ] ) {
            n[i+1] = { text: n[i+1], row: n[i].row + 1 };
            o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
          }
        }

        for ( var i = n.length - 1; i > 0; i-- ) {
          if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null &&
               n[i-1] == o[ n[i].row - 1 ] ) {
            n[i-1] = { text: n[i-1], row: n[i].row - 1 };
            o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
          }
        }

        return { o: o, n: n };
      }
    };
}])
