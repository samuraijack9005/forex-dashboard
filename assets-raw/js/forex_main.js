var app = angular.module("mainApp", []);
app.controller("mainController", ['$scope', '$http', "$timeout", function($scope, $http, $timeout) {

    $scope.timeFrameArray = ["h1", "h4", "d1", "w1"];
    $scope.serverAddress='http://3.14.15.110:4000';
    $scope.timeFrame = 'h1';
    $scope.refreshButton = 'refresh-inactive';

    $scope.currencies = ['aud', 'usd', 'eur', 'cad', 'gbp', 'chf', 'jpy', 'nzd']
    $scope.apiCall = function() {
        $http({
            method: 'GET',
            url: $scope.serverAddress+'/api'
        }).then(function(response) {
            $scope.ApiData = response.data.data;
            $scope.weakStrong = $scope.ApiData[2];
            $scope.currencyMeter2 = $scope.ApiData[0]


        }, function(error) {
            console.log(error);
        });
    }
    $scope.apiCall();

    $scope.chartFunc = function(time) {

        let bullData = [];
        let bearData = [];
        $scope.animal = $scope.ApiData[0][time]

        for (let i = 0; i < $scope.currencies.length; i++) {

            bullData.push({
                'label': $scope.currencies[i],
                'y': $scope.animal[$scope.currencies[i]].bull
            })

            bearData.push({
                'label': $scope.currencies[i],
                'y': $scope.animal[$scope.currencies[i]].bear
            })
        }

        var chart1 = new CanvasJS.Chart("animals", {
            height: 190,
            width: 300,
            axisY: {
                labelFontSize: 10,
                margin:-18
            },
            axisX:{

            },
            data: [{
                    type: 'bar',
                    color: 'green',
                    dataPoints: bullData
                },
                {
                    type: 'bar',
                    color: 'red',
                    dataPoints: bearData
                }
            ]
        });
        chart1.render();
        $(".canvasjs-chart-credit").remove();

    }

    $scope.getDxy = function() {
        $http({
            method: 'GET',
            url: $scope.serverAddress+'/dxy'
        }).then(function(response) {
            $scope.currentDxy = response.data.data[0].current;
            $scope.changeDxy = response.data.data[0].change;

        }, function(error) {
            console.log(error);
        });
    }
    $scope.getDxy();
    setInterval(function() { $scope.getDxy() }, 5000)


    $scope.getNews = function() {
        $scope.breakingNews = [];
        $scope.stories = [];
        $http({
            method: 'GET',
            url: $scope.serverAddress+'/news'
        }).then(function(response) {
            $scope.refreshButton = 'refresh-inactive';
            angular.element('#refresh-button').removeClass('class-rotate')
            $scope.newsRaw = response.data.data;
            for (let i = 0; i < $scope.newsRaw.length; i++) {
                if ($scope.newsRaw[i].impact == 'high' || $scope.newsRaw[i].impact == 'medium') {
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
    setInterval(function() {
        $scope.refreshButton = 'refresh-active';
        $scope.getNews()
    }, 600000)
    let c = 0;
    $scope.refreshNews = function() {
        $scope.refreshButton = 'refresh-active';
        angular.element('#refresh-button').addClass('class-rotate')
        $scope.getNews();

        c++
        console.log($scope.refreshButton)
    }
    $scope.changeCal = function(list) {
        console.log(list)
        $scope.currentEvents = [];
        $scope.currentEvents = list;
    }
    $scope.getCalendar = function() {
        $http({
            method: 'GET',
            url: $scope.serverAddress+'/calendar'
        }).then(function(response) {
            $scope.todaysEvents = [];
            $scope.tomorrowsEvents = [];
            $scope.calendarData = JSON.parse(JSON.stringify(response.data.data));
            let startIndex = -1;
            let endIndex = -1;
            $scope.startFound = false;
            for (let i = 0; i < $scope.calendarData.length; i++) {
                let data = JSON.parse(JSON.stringify($scope.calendarData[i]))
                if (data['date'] == 'today') {
                    if (!$scope.startFound) {
                        if (startIndex == -1) {
                            startIndex = i;
                            $scope.startFound = true;
                            continue;
                        }
                    }
                }
                if ($scope.startFound && data['date'] != 'today') {
                    endIndex = i;
                    break;
                }
            }
            $scope.yesterdaysEvents = $scope.calendarData.slice(0, startIndex);
            $scope.todaysEvents = $scope.calendarData.slice(startIndex, endIndex);
            $scope.tomorrowsEvents = $scope.calendarData.slice(endIndex, $scope.calendarData.length);
            console.log($scope.calendarData)
            console.log(startIndex, endIndex);
            console.log($scope.yesterdaysEvents)
            console.log($scope.todaysEvents)
            console.log($scope.tomorrowsEvents)
            $scope.changeCal($scope.todaysEvents);

        }, function(error) {
            console.log(error);
        });
    }
    $scope.getCalendar();






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
        let str=string.replace(/[0-9]/g,'X');
        str=str.replace(/[;]/g,'X');
        str = str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

        return str.split(" ").join("-")
    };
}])

app.filter('timeFilter', [function() {
    return function(string) {

        let str = string.replace(/ago/g, '');
        str = str.replace(/min/g, 'm')
        str = str.replace(/hr/g, 'h')
        return str
    };
}])

app.filter('dateSlice', [function() {
    return function(string) {
        return string.slice(0,string.length-2)
    };
}])