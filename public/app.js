import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';
import  _ from "lodash";


import 'ui/autoload/styles';
import './less/main.less';
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

        $scope.title = 'Kibana Api';
        $scope.description = 'This plugin allow you to crete visualization dynamiclly';
        const currentTime = moment($route.current.locals.currentTime);
        $scope.currentTime = currentTime.format('HH:mm:ss');
        const unsubscribe = $interval(function () {
            $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
        }, 1000);
        $scope.$watch('$destroy', unsubscribe);



    });
