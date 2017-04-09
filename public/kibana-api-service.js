import _ from 'lodash';
import rison from 'rison'

export class KibanaApiService {

    /**
     * create visualization by minimal parameters, this function if for developer that do not know very well visualization structure
     * @param iVisArr
     * @param iVisStructure
     * @returns {*}
     */
    static createVisByPartialParameters(iVisArr, iVisStructure) {
        try {
            let that = this;
            let visStateArr = [];
            let wellFormState = {};
            _.forEach(iVisArr, function (vis) {
                let wellFormVis = {};
                KibanaApiService.validateVisInput(vis);

                wellFormState = that.getWellFormVisState(vis, iVisStructure);
                let title = vis.title;
                if (title == undefined)
                    title = vis.visId;

                wellFormState.title = title;

                wellFormVis.visState = _.cloneDeep(wellFormState);
                wellFormVis.id = vis.id;
                wellFormVis.visIndex = vis.visIndex;

                console.log(vis);
                visStateArr.push(wellFormVis);

            })
            return that.createVisByVisState(visStateArr);
        } catch (e) {
            return {error: e}
        }


    }

    /**
     * get array of well formed visualization json
     * @param iVisArr
     * @returns {*}
     */
    static createVisByVisState(iVisArr) {

        try {
            let visStateArr = [];
            let that = this;
            _.forEach(iVisArr, function (vis) {
                if (vis) {
                    visStateArr.push({
                        id: vis.id,
                        state: that.createVisState(vis.visState['title'], vis.visState, vis.visIndex)
                    });
                }

            })
            if (visStateArr.length > 0) {
                return KibanaApiService.beforeCallElastic(visStateArr);
            }

        } catch (e) {
            return {error: e}
        }


    }

    /**
     * get well formed visualization json
     * @param iVis
     * @param iVisStructure
     * @returns {*}
     */
    static getWellFormVisState(iVis, iVisStructure) {
        let visState;
        var config = iVisStructure.visStats;

        //default vis state from the config
        if (iVis.visState && iVis.visState.visType)
            visState = config[iVis.visState.visType];
        else
            visState = config["pie"];

        _.forEach(iVis.visState, function (value, inputState) {
            switch (inputState) {
                case 'shareYAxis':
                case 'addTooltip':
                case 'addLegend':
                case 'legendPosition':
                case 'isDonut':
                    visState.params[inputState] = value;
                    break;
                case 'field':
                case 'size':
                case 'interval':
                    visState.aggs[1].params[inputState] = value;
                    break;

                case 'aggMetricType':
                    visState.aggs[0]['type'] = value;
                    break;
                case 'aggBucketType':
                    visState.aggs[1]['type'] = value;
                    break;

            }
        })
        return visState;
    }

    /**
     *get visualization state
     * @param iTitle
     * @param iVisState
     * @param iIndex
     * @returns {{title: *, visState, uiStateJSON: string, description: string, kibanaSavedObjectMeta: {searchSourceJSON}}}
     */
    static createVisState(iTitle, iVisState, iIndex) {
        let kibanaSavedObjectMeta = {
            searchSourceJSON: {
                index: iIndex,
                query: {query_string: {query: "*", analyze_wildcard: true}},
                filter: []
            }
        };
        return {
            title: iTitle,
            visState: JSON.stringify(iVisState),
            uiStateJSON: "{}",
            description: "",
            kibanaSavedObjectMeta: {"searchSourceJSON": JSON.stringify(kibanaSavedObjectMeta.searchSourceJSON)}
        };
    }

    /**
     * the final step before call elastic
     * @param iVisStateArr
     * @returns {Array}
     */
    static beforeCallElastic(iVisStateArr) {
        let visArr = [];

        _.forEach(iVisStateArr, function (visState) {

            visArr.push({id: visState.id, body: visState.state});
        })
        return visArr;


    }

    /**
     * valid input
     * @param iVis
     */
    static validateVisInput(iVis) {
        if (iVis.id == undefined)
            console.log('%cyou send visualization without id', "color:red");
        if (iVis.field == undefined)
            console.log('you send visualization without field');


    }

    static changeUrl(iUrl, iNewVisArr) {
        let kibanaAppObject = rison.decode(this.getQueryVariable("_a", iUrl));
        let kibanaGlobalObject = rison.decode(this.getQueryVariable("_g", iUrl));

        _.forEach(iNewVisArr, function (newVis) {
            if (newVis.prevoiusVisId) {
                KibanaApiService.handleIfHasPreviousId(newVis, kibanaAppObject.panels,);
            }
            else {
                kibanaAppObject.panels.push(KibanaApiService.getVisDashboardObject(newVis, kibanaAppObject.panels.length + 1));
            }
        })

        return "/dashboard?embed=true" + "&_g=" + rison.encode((kibanaGlobalObject)) + "&_a=" + rison.encode((kibanaAppObject));

    }

    static handleIfHasPreviousId(iNewVis, iPanels) {
        let preVisIndex = _.findIndex(iPanels, function (o) {
            return o.id == iNewVis.prevoiusVisId;
        });
        //need to delete vis
        if (iNewVis.visState == null)
            iPanels.splice(preVisIndex, 1);
        else {
            //need to switch vis
            iPanels[preVisIndex].id = iNewVis.id;
        }
    }

    static getVisDashboardObject(iNewVis, iPanelIndex) {
        if (iNewVis && iNewVis.visDashboardDefenetion)
            return iNewVis.visDashboardDefenetion
        return {col: 1, id: iNewVis.id, panelIndex: iPanelIndex, row: 1, size_x: 3, size_y: 2, type: "visualization"}
    }

    static getQueryVariable(iVariable, iQuery) {
        let separators = ['\\\?', '&'];
        let tokens = iQuery.split(new RegExp(separators.join('|'), 'g'));
        for (let i = 0; i < tokens.length; i++) {
            let pair = tokens[i].split('=');
            if (decodeURIComponent(pair[0]) == iVariable) {
                return decodeURIComponent(pair[1]);
            }
        }
        ;
        return null;
    }

}