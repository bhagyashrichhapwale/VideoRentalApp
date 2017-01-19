var app = angular.module('videorental',['ui.router','ngResource','ngAnimate', 'ui.bootstrap','ngCookies']);
var token = "";

/*
app.config(['$routeProvider',function($routeProvider){
	$routeProvider.
		when('/',{
			templateUrl:'/partials/home.html',
			controller:'HomeCtrl'
		})
		.otherwise({
			redirectTo:'/'

		});
}]);

*/

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.otherwise('/home');


	$stateProvider.
		state('home',{
			url:'/home',
			views: {
				'main@':{
					templateUrl:'/partials/home.html'
					
				}
			}
		})
		.state('mainmenu',
		{
			parent:'home',
			url:'/mainmenu',
			views:
			{
				'main@':{
				 templateUrl:'partials/sidebarhome.html',
				 controller:'videoListCtrl'
					

				}
			}
		}
		)
		.state('videolist',{
			parent:'home',
			url:'/videolist',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'videoListCtrl'
					
				}
			}
		}
		)
		.state('newreleases',{
			parent:'home',
			url:'/release',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'newReleaseCtrl'
					
				}
			}
		}
		)
		.state('toprated',{
			parent:'home',
			url:'/toprated',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'topRatedCtrl'
					
				}
			}
		}
		)
		.state('genreList',{
			parent:'home',
			url:'/genrelist/:genre',
			views:
			{
				'main@':{
					templateUrl:'partials/sidebarhome.html',
					controller:'genreListCtrl'
				}
			}
		})
		.state('videodet',{
			parent:'videolist',
			url:'/videodet/:id',
			views:
			{
				'main@':{
					templateUrl:'partials/videodet.html',
					controller:'videoDetCtrl'
				}
			}
		})
		.state('addvideo',{
			
			url:'/addvideo',
			views:
			{
				'main@':{
				 templateUrl: '/partials/addvideo.html',
				 controller:'addvideoCtrl'
				}
			}
		})
		.state('moddelvideo',
		{
			parent:'home',
			url:'/moddelvideo/:id',
			views:
			{
				'main@':{
					templateUrl:'partials/moddelvideo.html',
					controller:'moddelvideoCtrl'
				}
			}
		})
		.state('signup',
		{
			url:'/signup',
			views:
			{
				'main@':{
					templateUrl:'partials/signup.html',
					controller:'registerlogin'

				}
			}
		})
		.state('signin',
		{
			url:'/signin',
			views:
			{
				'main@':{
					templateUrl:'partials/signin.html',
						controller:'registerlogin'

				}
			}
		})
		
		;



}]);



app.controller('videoDetCtrl',['$scope','$resource','$stateParams','$location','$cookieStore',videoDetCtrl]);

function videoDetCtrl($scope,$resource,$stateParams,$location,$cookieStore)
{

	var Videos = $resource('/api/videos/:id');

	alert("Inside videoDetCtrl ");
	alert("userid "+$cookieStore.get('userid'));
	var token =  $cookieStore.get('token');
	alert("token"+token ); 




	Videos.get({id:$stateParams.id},function(video){
		alert("Inside get"+video.title);
		$scope.video = video;
	});

	var Order = $resource('/orders');

	var order = {
		userid: $cookieStore.get('userid'),
		videoid: $stateParams.id,
		dateoforder: new Date(),
		orderstatus : "In Progress"
	};

	$scope.rent = function()
	{

		if($cookieStore.get('token') == undefined || $cookieStore.get('userid') == undefined || $cookieStore.get('token') == "" || $cookieStore.get('userid') == "")
		{
			$scope.error = "To rent a dvd please sign up if you are a new customer else sign in";
			return false;
		}

		Order.save({token:token},order,function(data)
		{
			//alert("Order Saved in database");
			if(data.success == false)
				$scope.error = "Your order was not saved.Please try again";
			else
				$scope.success = true;
			//$location.path('/home');
		});
	}
}




app.controller('videoListCtrl',['$scope','$resource','$cookieStore',videoListCtrl]);

function videoListCtrl($scope,$resource,$cookieStore)
{
	//alert("Token in list "+$cookieStore.get('token'));
	var videos = $resource('/api/videos');
	$scope.temp = "bhagi";

	videos.query({token:token},function(videos){
		$scope.videos = videos;
	});
}

//New releases

app.controller('newReleaseCtrl',['$scope','$resource','$cookieStore',newReleaseCtrl]);

function newReleaseCtrl($scope,$resource,$cookieStore)
{
	//alert("Token in list "+$cookieStore.get('token'));
	var videos = $resource('/api/videos');
	$scope.temp = "bhagi";

	videos.query({option:"newreleases"},function(videos){
		$scope.videos = videos;
	});
}

//Top Rated

app.controller('topRatedCtrl',['$scope','$resource','$cookieStore',topRatedCtrl]);

function topRatedCtrl($scope,$resource,$cookieStore)
{
	//alert("Token in list "+$cookieStore.get('token'));
	var videos = $resource('/api/videos');
	$scope.temp = "bhagi";

	videos.query({option:"toprated"},function(videos){
		$scope.videos = videos;
	});
}


app.controller('genreListCtrl',['$scope','$resource','$stateParams','$location','$cookieStore',genreListCtrl]);

function genreListCtrl($scope,$resource,$stateParams,$location,$cookieStore)
{
	alert("Inside the genrelist "+$stateParams.genre);

	var Videos = $resource('/api/videos');

	Videos.query({genre:$stateParams.genre},function(videos){
		$scope.videos = videos;
	});
}




app.controller('addvideoCtrl',['$scope','$resource','$location',addvideoCtrl]);

function addvideoCtrl($scope,$resource,$location)
{
	var Videos = $resource('/api/videos');

	$scope.save = function()
	{
		Videos.save({token:token},$scope.video , function(video){
			$location.path('/home');
		});
	};

}	

app.controller('moddelvideoCtrl',['$scope','$resource','$location','$stateParams',moddelvideoCtrl]);

function moddelvideoCtrl($scope,$resource,$location,$stateParams)
{
	var Videos = $resource('/api/videos/:id',{id:'@_id'},
	{
		update : {method:'PUT'}
	}
	);

	Videos.get({id:$stateParams.id},function(video){
		alert("Inside get"+video.title);
		$scope.video = video;
	});


	$scope.save = function()
	{
		Videos.update($scope.video,function()
		{
			$location.path('/home');
		});
	}

	$scope.delete = function()
	{
		Videos.delete({id:$stateParams.id},function(video)
		{
			$location.path('/home');
		})
	}

}

app.controller('registerlogin',['$scope','$resource','$location','$cookieStore',registerlogin]);

function registerlogin($scope,$resource,$location,$cookieStore)
{
	alert("Inside register login controller");

	$scope.save = function(isValid)
	{
		$scope.submitted = true;

		if(isValid)
		{


		var User = $resource('/setup');

		alert($scope.user.name);

		User.save($scope.user,function(user)
		{
			$scope.user = user;
			
		});

			if($scope.login(true)){
				alert("Login is true");
				$location.path('/');	
			}
		}
		else
		{
			alert("Not valid hence returning fallse")
			return false;
		}

	}

	$scope.login = function(isValid)
	{
		alert("Inside login");
		var loginUser = $resource('/setup/authenticate');

		$scope.submitted = true;

		if(isValid)
		{

			loginUser.save($scope.user,function(data){
				alert("User login sucessfull"+JSON.stringify(data));
				token = data.token;
				admin = data.admin;
				userid = data._id;

				 token = data.token;
				var admin = data.admin;
				

				$cookieStore.put('token',data.token);
				$cookieStore.put('userid',data.userid);


				//alert("token in login "+token);
				//currentUser.setProfile($scope.user.name,data.token);		

				//$location.path('/');
			});

			return isValid;
		}
		else
		{
			alert("Input is not correct");
			return false;
		}
				
	}

}

