'use strict';

angular.module('newsyApp.controllers.onearticle', ['newsyApp.services.articles'])
  .controller('OneArticleController', ['$scope','$routeParams', '$location', '$modal', '$log', '$sce', '$cookieStore', 'Articles',
    function($scope, $routeParams, $location, $modal, $log, $sce, $cookieStore, Articles) {
      
      $scope.articleId = $location.search().articleId;

      $scope.findArticle = function(){
        Articles.find($scope.articleId, function(article){
          $scope.article = article;
          $scope.timeline = article.timeline;
          $scope.hashtags = article.hashtags;
          $scope.editMax = article.timeline.length;
          $scope.currentEditIndex = article.timeline.length;

          Articles.getTweets(article.hashtags, function(resTweets) {
            $scope.tweets = resTweets;
          });
        });
      };

//==========Timeline Functionality===========
      $scope.stringOrHTML = function(paragraph){
        if(typeof paragraph === 'string'){
          return 'string'
        } else {
          return 'HTML'
        }
      }

      $scope.enableTimeline = function(){
        $scope.timelineActive = true;

        var currentTextPristine = angular.copy($scope.article.article.paragraphs);
        var currentTextEdited = $scope.article.article.paragraphs;

        var updateText = function(){
          var timelineEdit = $scope.timeline[$scope.currentEditIndex].article.paragraphs;

          for(var i = 0; i < currentTextPristine.length; i++){
            currentTextEdited[i].currentText = $sce.trustAsHtml(diffString(timelineEdit[i].currentText, currentTextPristine[i].currentText))
          }
        }

        $scope.timelineId = setInterval(function(){
          $scope.currentEditIndex--
          updateText()
          $scope.$apply()
        }, 1000)
      }

      $scope.pauseTimeline = function(){
        clearInterval($scope.timelineId)
      }

//==========Twitter Functionality===========
      $scope.showHashtags = false;
      
      $scope.submitHashtags = function() {
        if($scope.hashtags === null){
          $scope.hashtags = '';
        }
        Articles.replaceHashtags($scope.articleId, $scope.hashtags);
      };

//==========Modal Functionality===========

      //function to open the modal
      $scope.editParagraph = function(paragraph, paragraphIndex) {
        var modalInstance = $modal.open({

          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl,
          resolve: {
            paragraph: function () {
              return paragraph;
            },
            paragraphIndex: function() {
              return paragraphIndex;
            }
          }
        });

        modalInstance.result.then(function(refresh){
          if(refresh){
            $scope.findArticle();
          }
        })
      };
$scope.hashtags = "#obama1";
      $scope.getTweets = function(){
      Articles.getTweets($scope.hashtags, function(res){
        //not sure how to angularize this res object..
        $scope.tweets = res;
      });
    };

    //function to create the modal that gets displayed
    var ModalInstanceCtrl = function ($scope, $modalInstance, paragraph, paragraphIndex) {


      $scope.articleId = $location.search().articleId;
      $scope.modalHeader = 'Current Text:';
      $scope.currentText = paragraph.currentText;
      $scope.proposedTexts = paragraph.proposedText;
      $scope.showEdit = false;
      $scope.refresh = false;

      $scope.voteUp = function(editIndex){
        if(++this.proposedText.vote > 1){
          Articles.replaceParagraph($scope.articleId, paragraphIndex, editIndex, $cookieStore.get('currentUser').username);

          $scope.refresh = true;
        } else {
          Articles.voteUp($scope.articleId, paragraphIndex, editIndex);
        }

      };

      $scope.voteDown = function(){
      };

      $scope.newEdit = function(){
        $scope.showEdit = true;
        $scope.modalHeader = "Proposed Edit:";
      };

      $scope.submit = function(currentText, source){
        Articles.newEdit($scope.articleId, paragraphIndex, currentText, source, $cookieStore.get('currentUser').username);
        $scope.refresh = true;
        $modalInstance.close($scope.refresh);
      };

      $scope.cancel = function () {
        $modalInstance.close($scope.refresh);
      };

      $scope.getDiff = function(currentText, item){
        return $sce.trustAsHtml(diffString(currentText, item))
      };
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
    };
}]);
