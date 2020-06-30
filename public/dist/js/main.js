var app = angular.module("mainApp", []);
app.controller("mainController",['$scope','$http',"$timeout", function($scope, $http, $timeout) {

$scope.timeFrameArray=["h1","h4","d1","w1"];
$scope.timeFrame='h1';

$scope.currencies=['aud', 'usd', 'eur', 'cad','gbp', 'chf', 'jpy', 'nzd']
    $scope.apiCall = function() {
        $http({
            method: 'GET',
            url: 'https://samuraijack9005-currency-meter-1.glitch.me/api'
        }).then(function(response) {
            $scope.ApiData = response.data.data;
            $scope.weakStrong=$scope.ApiData[2];
            $scope.currencyMeter2=$scope.ApiData[0]


        }, function(error) {
            console.log(error);
        });
    }
$scope.apiCall();

    $scope.chartFunc = function(time) {
        
        let bullData=[];
        let bearData=[];
        $scope.animal=$scope.ApiData[0][time]

        for (let i = 0; i < $scope.currencies.length; i++) {

            bullData.push({
              'label':$scope.currencies[i],
              'y':$scope.animal[$scope.currencies[i]].bull
            })

            bearData.push({
              'label':$scope.currencies[i],
              'y':$scope.animal[$scope.currencies[i]].bear
            })
        }
       
        var chart1 = new CanvasJS.Chart("animals", {
            height:260,
            width:300,
            axisY:{
               title:time,
               labelFontSize:10
            },
            data: [
            {
              type:'bar',
              color:'green',
              dataPoints:bullData
            },
             {
              type:'bar',
              color:'red',
              dataPoints:bearData
            }
            ]
        });
        chart1.render();
        $( ".canvasjs-chart-credit" ).remove();
     
    }
   
   $scope.getDxy=function(){
     $http({
            method: 'GET',
            url: 'https://samuraijack9005-currency-meter-1.glitch.me/dxy'
        }).then(function(response) {
            $scope.currentDxy=response.data[0].current;
            $scope.changeDxy=response.data[0].change;

        }, function(error) {
            console.log(error);
        });
   }
  $scope.getDxy();
  setInterval(function(){$scope.getDxy()},5000)

     
     $scope.getNews=function(){
      $scope.breakingNews=[];
      $scope.stories=[];
     $http({
            method: 'GET',
            url: 'https://samuraijack9005-currency-meter-1.glitch.me/news'
        }).then(function(response) {
          $scope.newsRaw=response.data;
          for(let i=0;i<$scope.newsRaw.length;i++){
              if($scope.newsRaw[i].impact=='high' || $scope.newsRaw[i].impact=='medium'){
                $scope.breakingNews.push($scope.newsRaw[i])
              } else {
                $scope.stories.push($scope.newsRaw[i])
              }
          }

        }, function(error) {
            console.log(error);
        });
   }

   $scope.getNews();
    setInterval(function(){$scope.getNews()},600000)
    
}]);


app.filter('first60', [function() {
    return function(string) {
       
        if (string.length > 60) {
            return string.slice(0, 60) + "...";
        } else {
            return string;
        }
    };
}])

app.filter('idTypeCast', [function() {
    return function(string) {
       
        let str=string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        return str.split(" ").join("-")
    };
}])

app.filter('timeFilter', [function() {
    return function(string) {
       
        let str=string.replace(/ago/g, '');
        str=str.replace(/min/g,'m')
        str=str.replace(/hr/g,'h')
        return str
    };
}])