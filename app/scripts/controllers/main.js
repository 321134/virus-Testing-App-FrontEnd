'use strict';

/**
 * @ngdoc function
 * @name frontEndApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontEndApp
 */
angular.module('frontEndApp')
.controller('MainCtrl', ['$scope', 'ngDialog', function ($scope, ngDialog) {
  $scope.OpenLoginModal = function () {
    console.log('In function');
    ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:'LoginController' });
  };
}])
.controller('LoginController', ['$scope', 'ngDialog', 'AuthFactory', function($scope, ngDialog, AuthFactory) {
  console.log('In controller');
  $scope.loginData = {username: '', password: ''};

  $scope.doLogin = function() {
    AuthFactory.login($scope.loginData);
  };

}])

.controller('DataController', ['$scope', 'DataFactory', function($scope, DataFactory) {
  $scope.filesExist = false;
  $scope.file = '';
  DataFactory.getAllFiles().query(
    function(response) {
      $scope.filesExist = true;
      $scope.documents = response;
    },
    function(response) {
      $scope.filesExist = false;
      $scope.message = "Error: "+response.status + " " + response.statusText;
    }
  );

  $scope.uploadFile = function () {
     // console.log(filename);
    DataFactory.loadFileToDB($scope.file);
  };

  $scope.downloadFile = function (doc) {
    console.log('Document to be downloaded: ' + doc);
    
  };
}]);
