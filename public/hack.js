import uiModules from 'ui/modules';
import Q from 'q';
import {KibanaApiService} from "./kibana-api-service";
uiModules.get('app/dashboard', []).run(function ($http, $location, kbnUrl, getAppState) {
    let visStructure;

    $http.get('../api/visStructure').then((response) => {
        visStructure = response.data;
    });

    /**
     * Call kibana server
     * @param visArr
     * @returns {Promise<T>|*|promise}
     */
    function callServer(visArr) {
        let deferred = Q.defer();

        $http.post('../api/createVis/createVisByVisState', visArr).then((response) => {
            deferred.resolve()
        });
        return deferred.promise;
    }

    /**
     * refresh dashboard after the visualization create in kibana
     * @param iNewUrl
     */
    function refreshDashboard(iNewVisArr) {
        let newUrl = KibanaApiService.generateUrl($location.url(), iNewVisArr);
        kbnUrl.change(newUrl);
    }


//catch post message event

    let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    let eventer = window[eventMethod];
    let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


    let eventMessageHandler = function (e) {


        switch (e.data.actionType) {
            case "setVisualization":

                let partialVisArr = _.filter(e.data.visDefenetion, function (o) {
                    return !o.isFullState;
                });
                let fullVisArr = _.filter(e.data.visDefenetion, function (o) {
                    return o.isFullState;
                });

                let resultFull = KibanaApiService.createVisByVisState(fullVisArr);
                let resultPartial = KibanaApiService.createVisByPartialParameters(partialVisArr, visStructure);

                if (resultFull.error || resultPartial.error)
                    console.log(resultFull.error, resultPartial.error);
                else {
                    callServer(resultFull.concat(resultPartial)).then(function () {
                        refreshDashboard(e.data.visDefenetion);
                    })
                }
                return;

            case "addSearchChip":
                getAppState().filters.push(KibanaApiService.handleTextFilter(e.data.text, e.data.index));
                getAppState().save();
                return;

        }


    };

// Listen to message
    eventer(messageEvent, eventMessageHandler, false);


})
;


