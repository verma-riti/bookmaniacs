'use strict'
var myApp = angular.module('myApp', ['ngRoute','ui.materialize']);
myApp.config(['$routeProvider' , function($routeProvider)
	{
		$routeProvider.when('/' ,
		{
			templateUrl :"partials/home.html"
		})
		.when('/preview/:bookId',
		{
			templateUrl :"partials/preview.html"
		}).when('/checkout/',
        {
            templateUrl :"partials/checkout.html"
        }).when('/cartDetails/',
        {
            templateUrl :"partials/cartDetails.html"
        })
		.otherwise({redirectTo : '/'});
	}]);

myApp.directive('addToCartButton', function() {
    var num_of_item=0;
    function fly(scope, element, attributes){
        element.on('click',function(event){
            num_of_item += 1;
            var cartElem = angular.element(document.getElementsByClassName('cart'));   
            var offsetTopCart  = cartElem.prop('offsetTop');
            var offsetLeftCart = cartElem.prop('offsetLeft');
            var widthCart      = cartElem.prop('offsetWidth');
            var heightCart     = cartElem.prop('offsetHeight');
            var imgElem        = angular.element(event.target.parentNode.parentNode.childNodes[1]);
            var parentElem     = angular.element(event.target.parentNode.parentNode);
            var offsetLeft     = imgElem.prop('offsetLeft');
            var offsetTop      = imgElem.prop('offsetTop');
            var imgSrc         = imgElem.prop('src');
            var imgClone       = angular.element('<img src="'+imgSrc+'"/>');
            //console.log('topCart'+offsetTopCart,'leftCart'+offsetLeftCart,'widthCart'+widthCart,'heightCart'+heightCart,'imgLeft'+offsetLeft,'imgTop'+offsetTop,'imgSrc'+imgSrc);
            imgClone.css({
                'height'    : '150px',
                'width'     : '120px',
                'position'  : 'absolute',
                'top'       : offsetTop +'px',
                'left'      : offsetLeft + 'px',
                'opacity'   : 0.5
            });

            imgClone.addClass('itemaddedanimate');
            parentElem.append(imgClone);
            setTimeout(function(){
                imgClone.css({
                    'height' : '75px',
                    'width'  : '50px',
                    'top'    : (offsetTopCart+heightCart/2)+'px',
                    'left'   : (offsetLeftCart+widthCart/2)+'px',
                    'opacity': 0.5
                });
            },500);

            setTimeout(function(){
                imgClone.css({
                    'height' :0,
                    'opacity':0.5
                });
                cartElem.addClass('shakeit ');
            },1000);

            setTimeout(function(){
                cartElem.removeClass('shakeit');
                imgClone.remove();
            },1500);
            $('.num_of_item').html(num_of_item);
        });
        
    };

    return {
        restrict: 'E',
        link: fly,
        transclude: true,
        replace: true,
        scope: {},
        template: '<button class="add-to-cart" ng-transclude></button>'
    };

});

myApp.controller('myCtrl', function($scope, $rootScope, $http ,$routeParams){
	$http({
      method: 'GET',
      url: 'books.json'
    }).then(function (response){
    	//console.log(response);
        $rootScope.books = response.data;
    },function (error){

   	});
   	$scope.hideDiv = true;
    $scope.inputSearch = function(text){
    	$scope.hideDiv = false;
        var output = [];
        $scope.book = $rootScope.books;
        
        $scope.book.items.forEach(function(items,i){
            
            $scope.title = $scope.book.items[i].volumeInfo.title;
            $scope.id = $scope.book.items[i].id;
            $scope.authors = $scope.book.items[i].volumeInfo.authors;
            $scope.publisher = $scope.book.items[i].volumeInfo.publisher;
            $scope.publishDate = $scope.book.items[i].volumeInfo.publishedDate;
            //console.log(indexOf(text.toLowerCase()));
            if($scope.title.toLowerCase().indexOf(text.toLowerCase())>=0){
                output.push($scope.title);
            }else if($scope.id.toLowerCase().indexOf(text.toLowerCase())>=0){
                output.push($scope.id);
            }
        });
        $scope.filterBook = output;
    }
    $scope.fillInput = function(book){
        $scope.search = book;
        $scope.hideThis = true;
        $scope.hideDiv = false;
    }
    $scope.cartHover =function(){
        
    }
    //$rootScope.cartItems = [];
    
});

myApp.controller('previewCtrl', function($scope, $rootScope, $http ,$routeParams){
	$scope.bookId = $routeParams.bookId;
    $scope.book = $rootScope.books;

    for(var i=1;i<$scope.book.items.length;i++){
    	if($scope.book.items[i].id == $scope.bookId){
    		$scope.title = $scope.book.items[i].volumeInfo.title;
            $scope.id =$scope.book.items[i].id;
    		$scope.thumbnail = $scope.book.items[i].volumeInfo.imageLinks.smallThumbnail;
    		$scope.image = $scope.book.items[i].volumeInfo.imageLinks.thumbnail;
    		$scope.authors = $scope.book.items[i].volumeInfo.authors;
    		$scope.publisher = $scope.book.items[i].volumeInfo.publisher;
    		$scope.publishDate = $scope.book.items[i].volumeInfo.publishedDate;
    		$scope.ISBN = $scope.book.items[i].volumeInfo.industryIdentifiers;
    		$scope.length = $scope.book.items[i].volumeInfo.pageCount;
    		$scope.avgRatings = $scope.book.items[i].volumeInfo.averageRating;
    		$scope.subtitle = $scope.book.items[i].volumeInfo.subtitle;
    		$scope.textSnippet = $scope.book.items[i].searchInfo.textSnippet;
	       
            $rootScope.cartItems = [];
            $scope.addToCart = function(id ,title ,thumbnail){
                $scope.cartItems.push({ title: title , thumbnail:thumbnail});
                console.log($scope.cartItems);
            }
        }
	}

});

myApp.controller('checkoutCtrl', function($scope,$rootScope,$http ,$routeParams){
    $scope.bookId = $routeParams.bookId;
    $scope.cartItems = $rootScope.cartItems;
    $scope.deleteCart = function(title,thumbnail){
       if (confirm("Are You Sure ?!") == true) {
            $scope.cartItems=[];
        } else {
            return false;
        }
    }
    $scope.deleteItem= function(title,thumbnail){
        $scope.cartItems.pop({title:title , thumbnail:thumbnail});
        //$scope.cartItems.splice(1);
    }

});