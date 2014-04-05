'use strict';
 
angular.module('newsyApp.controllers.allarticles', ['newsyApp.services.articles'])
  .controller('AllArticlesController', ['$scope','$routeParams', '$location',
    function($scope, $routeParams, $location, Articles) {
    
      $scope.test = function(){
        $location.path('/science/article1');
      }

      $scope.findArticles = function() {
        $scope.articles = Articles.collection();
      }
 
      $scope.findOneArticle = function (articleId) {
        //reroute to new article on selection
      }

      $scope.sampleData = function(){
        $scope.articles = [{
          "poster"    : "Cleveland Brown", 
          "postTitle"     : "Steve Jobs and Pixar",
          "postSource": "http://gizmodo.com/how-steve-jobs-passion-shaped-pixar-into-an-oscar-winn-1557613093", 
          "article"   : {
            "title": "How Steve Job's Passion Shaped Pixar", 
            "image":  "http://i.kinja-img.com/gawker-media/image/upload/s--PnklgGQP--/c_fit,fl_progressive,w_636/eafavaozr8ru44did0yu.jpg",
            "paragraphs" : [
              {
                "currentText" : "Pixar occupied a special place in Steve's world, and his role evolved during our time together. In the early years, he was our benefactor, the one who paid the bills to keep the lights on. Later, he became our protector—a constructive critic internally but our fiercest defender to the outside. We had some trying times together, to be sure, but through those difficulties, we forged a rare bond.",
                "proposedText": [{
                  "editor": "Bill Gates", 
                  "text"  : "Pixar occupied a small place in Steve's world. In the early years, he was primarily our benefactor, the one who paid the bills to keep the lights on. Later, he became more involved—a constructive critic internally but our fiercest defender to the outside. We had some trying times together, to be sure, but through those difficulties, we forged a stronger bond.",
                  "vote"  : 0 
                }] 
              },
              {
                "currentText" : "While he never lost his intensity, we watched him develop the ability to listen. More and more, he could express empathy and caring and patience. He became truly wise. The change in him was real, and it was deep",
                "proposedText": [{
                  "editor": "", 
                  "text"  : "",
                  "vote"  : 0 
                }] 
              }
            ],
          "comments"  : [{
              "commentor": "Cho Kim",
              "comment"  : "Steve Job's is amazing."
            }, 
            {
              "commentor": "Eugene Choi",
              "comment " : "Steve Job's played a minor role in creating Pixar's success."
            }] 
          }
        },{
          "poster"    : "Cleveland Brown", 
          "postTitle"     : "Steve Jobs and Pixar",
          "postSource": "http://gizmodo.com/how-steve-jobs-passion-shaped-pixar-into-an-oscar-winn-1557613093", 
          "article"   : {
            "title": "How Steve Job's Passion Shaped Pixar", 
            "image":  "http://i.kinja-img.com/gawker-media/image/upload/s--PnklgGQP--/c_fit,fl_progressive,w_636/eafavaozr8ru44did0yu.jpg",
            "paragraphs" : [
              {
                "currentText" : "Pixar occupied a special place in Steve's world, and his role evolved during our time together. In the early years, he was our benefactor, the one who paid the bills to keep the lights on. Later, he became our protector—a constructive critic internally but our fiercest defender to the outside. We had some trying times together, to be sure, but through those difficulties, we forged a rare bond.",
                "proposedText": [{
                  "editor": "Bill Gates", 
                  "text"  : "Pixar occupied a small place in Steve's world. In the early years, he was primarily our benefactor, the one who paid the bills to keep the lights on. Later, he became more involved—a constructive critic internally but our fiercest defender to the outside. We had some trying times together, to be sure, but through those difficulties, we forged a stronger bond.",
                  "vote"  : 0 
                }] 
              },
              {
                "currentText" : "While he never lost his intensity, we watched him develop the ability to listen. More and more, he could express empathy and caring and patience. He became truly wise. The change in him was real, and it was deep",
                "proposedText": [{
                  "editor": "", 
                  "text"  : "",
                  "vote"  : 0 
                }] 
              }
            ],
          "comments"  : [{
              "commentor": "Cho Kim",
              "comment"  : "Steve Job's is amazing."
            }, 
            {
              "commentor": "Eugene Choi",
              "comment " : "Steve Job's played a minor role in creating Pixar's success."
            }] 
          }
        },{
          "poster"    : "Cleveland Brown", 
          "postTitle"     : "Steve Jobs and Pixar",
          "postSource": "http://gizmodo.com/how-steve-jobs-passion-shaped-pixar-into-an-oscar-winn-1557613093", 
          "article"   : {
            "title": "How Steve Job's Passion Shaped Pixar", 
            "image":  "http://i.kinja-img.com/gawker-media/image/upload/s--PnklgGQP--/c_fit,fl_progressive,w_636/eafavaozr8ru44did0yu.jpg",
            "paragraphs" : [
              {
                "currentText" : "Pixar occupied a special place in Steve's world, and his role evolved during our time together. In the early years, he was our benefactor, the one who paid the bills to keep the lights on. Later, he became our protector—a constructive critic internally but our fiercest defender to the outside. We had some trying times together, to be sure, but through those difficulties, we forged a rare bond.",
                "proposedText": [{
                  "editor": "Bill Gates", 
                  "text"  : "Pixar occupied a small place in Steve's world. In the early years, he was primarily our benefactor, the one who paid the bills to keep the lights on. Later, he became more involved—a constructive critic internally but our fiercest defender to the outside. We had some trying times together, to be sure, but through those difficulties, we forged a stronger bond.",
                  "vote"  : 0 
                }] 
              },
              {
                "currentText" : "While he never lost his intensity, we watched him develop the ability to listen. More and more, he could express empathy and caring and patience. He became truly wise. The change in him was real, and it was deep",
                "proposedText": [{
                  "editor": "", 
                  "text"  : "",
                  "vote"  : 0 
                }] 
              }
            ],
          "comments"  : [{
              "commentor": "Cho Kim",
              "comment"  : "Steve Job's is amazing."
            }, 
            {
              "commentor": "Eugene Choi",
              "comment " : "Steve Job's played a minor role in creating Pixar's success."
            }] 
          }
        }]
      }

}])