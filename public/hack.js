//import {uiModules} from 'ui/modules';
const uiModules = require('ui/modules');

import Q from 'q';
import {KibanaApiService} from "./kibana-api-service";
import packageJson from '../package.json';

let kibanaVersion = packageJson.kibana.version;
uiModules.get('app/dashboard', []).run(function ($rootScope, $http, $route, $location, kbnUrl, getAppState, globalState) {
    let visStructure;
    let loaded = false;
    callServer('get', '../api/visStructure').then(function (response) {
        visStructure = response.data;
    });

    /**
     * Call kibana server
     * @param visArr
     * @returns {Promise<T>|*|promise}
     */
    function callServer(method, path, body) {
        let deferred = Q.defer();

        $http[method](path, body).then((response) => {
            deferred.resolve(response)
        });
        return deferred.promise;
    }

    /**
     * refresh dashboard after the visualization create in kibana
     * @param iNewUrl
     */
    function refreshDashboard(iNewVisArr) {
        let newUrl = KibanaApiService.generateUrl(getAppState(), globalState, iNewVisArr);
        kbnUrl.change(newUrl);
        $route.reload();
    }

    /**
     * Create index-pattern
     * @param iIndex
     * @param iTimeField
     */
    function createIndexPattern(iIndex, iTimeField) {
        let deferred = Q.defer();

        let request = {
            "title": iIndex
            // "notExpandable": true
        }
        if (iTimeField) {
            request["timeFieldName"] = iTimeField
        }
        callServer("post", '../api/createIndexPattern', request).then(function (response) {
            deferred.resolve(response);

        });
        return deferred.promise;

    }

    function setDefaultIndexPattern(iIndex) {
        let deferred = Q.defer();

        callServer("post", '../api/setIndexPattern', {
                title: iIndex
            }
        ).then(function (response) {
            deferred.resolve(response);

        });
        return deferred.promise;

    }

    /**
     * Get index pattern ID by title
     * @param iTitle
     * @returns {*}
     */
    function getIndexPatternId() {
        let deferred = Q.defer();
        callServer("post", '../api/getIndexPatternId', {}).then(function (response) {
            deferred.resolve(response.data);
        })
        return deferred.promise;

    }

    function isIndexPatternExist(iIndex) {
        let deferred = Q.defer();
        callServer("post", '../api/getIndexPatternId', {title: iIndex}).then(function (response) {
            deferred.resolve(response.data.length > 0);
        })

        return deferred.promise;

    }

    function postResToApp(funcName, msg) {
        parent.postMessage(funcName + "##" + JSON.stringify(msg), "*");

    }


//catch post message event

    let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    let eventer = window[eventMethod];
    let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


    let eventMessageHandler = function (e) {


        switch (e.data.actionType) {
            case "setVisualization":
                let partialVisArr = [], fullVisArr = [], titelsArr = [];

                _.forEach(e.data.visDefenetion, function (visState) {
                    visState.isFullState ? fullVisArr.push(visState) : partialVisArr.push(visState)
                    titelsArr.push(visState.visIndex);
                });

                getIndexPatternId().then(function (idsArr) {
                    _.forEach(e.data.visDefenetion, function (visState, i) {

                        let indexPattern = _.find(idsArr, function (current) {
                            return current.attributes.title == visState.visIndex
                        });

                        visState.visIndex = indexPattern.id;
                    });


                    let resultFull = KibanaApiService.createVisByVisState(fullVisArr);
                    let resultPartial = KibanaApiService.createVisByPartialParameters(partialVisArr, visStructure);

                    let allVisesState = resultFull.concat(resultPartial)


                    if (resultFull.error || resultPartial.error)
                        console.log(resultFull.error, resultPartial.error);
                    else {
                        callServer("post", '../api/createVis/createVisByVisState', allVisesState).then(function () {
                            refreshDashboard(e.data.visDefenetion);
                        })
                    }

                })
                return;

            case "addSearchChip":
                getAppState().filters.push(KibanaApiService.handleTextFilter(e.data.text, e.data.index));
                getAppState().save();
                return;

            case "flushSearchChip":
                getAppState().filters = [];
                //$location.url(KibanaApiService.getUrlFromObject(globalState, getAppState()));
                // KibanaApiService.removeAllFilters($location.url());
                getAppState().save();

                //refreshDashboard();
                return;

            case "createIndexPattern":
                createIndexPattern(e.data.index, e.data.timeField).then(function (res) {
                    postResToApp("createIndexPattern", res);
                });

                return;

            case "setDefaultIndexPattern":
                setDefaultIndexPattern(e.data.indexPattern).then(function (res) {
                    postResToApp("setDefaultIndexPattern", res);
                });

                return;

            case "isIndexPatternExist":
                isIndexPatternExist(e.data.indexPattern).then(function (res) {
                    postResToApp("isIndexPatternExist", res);
                });
                return;

            case "setDashboardTime":

                $rootScope.$$timefilter.time.from = e.data.time.from;
                $rootScope.$$timefilter.time.to = e.data.time.to;
                $rootScope.$$timefilter.time.mode = e.data.time.mode;
                refreshDashboard([]);

                return;
        }


    };

// Listen to message
    eventer(messageEvent, eventMessageHandler, false);
    $rootScope.$on('$routeChangeSuccess', () => {
        if (!loaded) {
            loaded = true;
            // setTimeout(function () {
            //     console.log('$routeChangeSuccess');
            //     postResToApp("load", "finish load iframe");
            // }, 1);

        }
    })


})
;


