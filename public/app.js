//import {uiModules} from 'ui/modules';
const uiModules = require('ui/modules');

import uiRoutes from 'ui/routes';
import  _ from "lodash";


import 'ui/autoload/styles';
import './less/main.less';
import {KibanaApiService} from './kibana-api-service'
import template from './templates/index.html';
uiRoutes.enable();
uiRoutes
    .when('/', {
        template: template,
        controller: 'kibanaApiHelloWorld',
        controllerAs: 'ctrl'
    })

uiModules
    .get('app/kibana_api', [])
    .controller('kibanaApiHelloWorld', function ($scope, $route, $interval, $http) {

        $scope.title = 'Kibana API';
        $scope.finishLoad = false;
        $scope.description = 'This plugin allow you to crete visualization dynamiclly';
        $scope.icon = "";

        let visStructure;

        $http.get('../api/visStructure').then((response) => {
            visStructure = response.data;
        });

        function readBlob() {
            var files = document.getElementById('files').files;
            if (!files.length) {
                alert('Please select a file!');
                return;
            }

            var file = files[0];
            if (file.name.split('.')[file.name.split('.').length - 1] != "json") {
                alert('You can load json file only');
            }
            else {
                var reader = new FileReader();

                // If we use onloadend, we need to check the readyState.
                reader.onloadend = function (evt) {
                    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                        $scope.finishLoad = true;
                        $scope.content = evt.target.result;
                        $scope.$apply();
                    }
                };

                var blob = file.slice();
                reader.readAsBinaryString(blob);
            }

        }

        function handleFileSelect(evt) {
            readBlob();
        }

        $scope.createVis = function () {
            let visArrJs = JSON.parse($scope.content);
            let partialVisArr = _.filter(visArrJs, function (o) {
                return !o.isFullState;
            });
            let fullVisArr = _.filter(visArrJs, function (o) {
                return o.isFullState;
            });

            let resultFull = KibanaApiService.createVisByVisState(fullVisArr);
            let resultPartial = KibanaApiService.createVisByPartialParameters(partialVisArr, visStructure);
            if (resultFull.error || resultPartial.error)
                console.log(resultFull.error, resultPartial.error);
            else {
                $http.post('../api/createVis/createVisByVisState', resultFull.concat(resultPartial)).then((response) => {
                    $scope.getResponse = true;
                    $scope.response = JSON.stringify(response.data.items);

                });

            }
        }

        document.getElementById('files').addEventListener('change', handleFileSelect, false);


    });
