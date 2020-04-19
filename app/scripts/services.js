'use strict';

angular.module('frontEndApp')
//.constant("baseURL","https://confusionserver.shen-confusion.com/")
.constant("baseURL","http://localhost:3000/")
.factory('DataFactory', ['$resource', 'Upload', 'baseURL', '$http', '$localStorage', 'ngDialog', function($resource, Upload, baseURL, $http, $localStorage, ngDialog) {
  var dataFac = {};
  var creds = $localStorage.getObject('Token');
  var message1 = '\
              <div class="ngdialog-message">\
              <h4 align=center><span>File Successfully Loaded</span><i class="fa fa-upload"></i><h4>';
  var message2 = '\
              <div class="ngdialog-message">\
              <h4 align=center><span>You are not authorized to upload a file</span></i><h4>';
  var message3 = '\
              <div class="ngdialog-message">\
              <h4 align=center><span>Some error occured while loading file</span></i><h4>';

  dataFac.loadFileToDB = function (file) {
    Upload.upload({
      url: baseURL + "files/upload", //webAPI exposed to upload the file
      data:{file:file}, //pass file as data, should be user ng-model
      headers:{'x-access-token' : creds.token}
    }).then(function (resp) { //upload function returns a promise
      if(resp.status == 200){ //validate success
        console.log("Successful")
        console.log('Success ' + resp.config.data.file.name);
        ngDialog.open({ template: message1, plain: 'true'});
      } else {
        ngDialog.open({ template: message3, plain: 'true'});
        console.log('Unsuccessful');
      }
    }, function (resp) { //catch error
      ngDialog.open({ template: message2, plain: 'true'});
      console.log('Error status is: ' + resp.status);
    });
  };

    dataFac.getAllFiles = function () {
      return $resource(baseURL + 'files', null, {headers: { 'x-access-token': creds.token }});
    };

    dataFac.downloadFileFromDB = function (doc) {
      $resource(baseURL + 'files/download/:filename', {filename: doc}, null).get(
        function (response) {
            console.log(response);
        },
        function (response) {
          console.log(response);
        }
      );
    };

  return dataFac;
}])
.factory('AuthFactory', ['$state', '$resource', 'baseURL', 'ngDialog', '$http', '$localStorage', function($state, $resource, baseURL, ngDialog, $http, $localStorage){
  var authFac = {};
  var TOKEN_KEY = 'Token';
  var isAuthenticated = false;
  var username = '';
  var authToken = undefined;
  var showError = false;

  // store the current logged in user credentials into localstorage
  // and set the token in the header for each request
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }

  // set the token in the header for each request from user
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }

  // remove all infomation of credentials
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }

  authFac.login = function(loginData) {

    $resource(baseURL + "users/login")
    .save(loginData,
      function(response) {
        ngDialog.close();
        console.log('Login Successful');
        storeUserCredentials({username:loginData.username, token: response.token});
        username = loginData.username;
        authToken = response.token;
        showError = false;
        $state.go('app.data', {}, {reload: true});
      },
      function(response){
        isAuthenticated = false;
        showError = true;
        ngDialog.close();
        alert("Wrong Username or Password");
        console.log('Login Unsuccessful');
      }
    );
  };
  authFac.isAuthenticated = function() {
    return isAuthenticated;
  };
  authFac.getUsername = function() {
    return username;
  };
  authFac.showErrorMessage = function() {
    return showError;
  };
  return authFac;
}])

.factory('$localStorage', ['$window', function ($window) {
  return {
    store: function (key, value) {
      $window.localStorage[key] = value;
    },
    get: function (key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function (key) {
      $window.localStorage.removeItem(key);
    },
    storeObject: function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function (key, defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  }
}]);
