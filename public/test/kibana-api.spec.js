/**
 * Created by arbel on 13/12/2016.
 */

import Sinon from "sinon";
import {KibanaApiService} from "../kibana-api-service";
import {expect} from 'chai';


describe('KibanaApiService', () => {
    let stubKibanaApiService;
    let stubCreateVisState;
    beforeEach(() => {

    });
    afterEach(() => {
        stubKibanaApiService.restore();
        stubCreateVisState.restore();
    });

    describe('createVisByVisState function', () => {
        beforeEach(() => {

        });
        afterEach(() => {
            stubKibanaApiService.restore();
        });
        it('should call beforeCallElastic', () => {
            stubKibanaApiService = Sinon.stub(KibanaApiService, 'beforeCallElastic');
             stubCreateVisState = Sinon.stub(KibanaApiService, 'createVisState').returns([""]);

            let state = {visId: 1, visState: {"title": "vis"}};
            KibanaApiService.createVisByVisState([state]);

            Sinon.assert.calledOnce(stubKibanaApiService);

        });
        it('should not call callElastic', () => {
            stubKibanaApiService = Sinon.stub(KibanaApiService, 'beforeCallElastic');
            KibanaApiService.createVisByVisState([]);
            Sinon.assert.callCount(stubKibanaApiService, 0);
        });
        it('should call beforeCallElastic', () => {
            stubKibanaApiService = Sinon.stub(KibanaApiService, 'beforeCallElastic');
            let state = {visId: 1, visState: {"title": "vis"}};
            KibanaApiService.createVisByVisState([state]);

            Sinon.assert.calledOnce(stubKibanaApiService);

        });
    });

    describe('createVisByPartialParameters function', () => {
        let validateVisInputStub, getWellFormVisStateStub;
        let config = {
            "visStats": {
                "pie": {
                    "title": "New Visualization",
                    "type": "pie",
                    "params": {
                        "shareYAxis": true,
                        "addTooltip": true,
                        "addLegend": true,
                        "legendPosition": "right",
                        "isDonut": false
                    },
                    "aggs": [
                        {
                            "id": "1",
                            "enabled": true,
                            "type": "count",
                            "schema": "metric",
                            "params": {}
                        },
                        {
                            "id": "2",
                            "enabled": true,
                            "type": "terms",
                            "schema": "segment",
                            "params": {
                                "field": "Region.keyword",
                                "size": 5,
                                "order": "desc",
                                "orderBy": "1"
                            }
                        }
                    ],
                    "listeners": {}
                },
                "histogram": {
                    "title": "New Visualization",
                    "type": "histogram",
                    "params": {
                        "shareYAxis": true,
                        "addTooltip": true,
                        "addLegend": true,
                        "legendPosition": "right",
                        "scale": "linear",
                        "mode": "stacked",
                        "times": [],
                        "addTimeMarker": false,
                        "defaultYExtents": false,
                        "setYExtents": false,
                        "yAxis": {}
                    },
                    "aggs": [
                        {
                            "id": "1",
                            "enabled": true,
                            "type": "count",
                            "schema": "metric",
                            "params": {}
                        },
                        {
                            "id": "2",
                            "enabled": true,
                            "type": "histogram",
                            "schema": "segment",
                            "params": {
                                "field": "azimuth",
                                "interval": 90,
                                "extended_bounds": {}
                            }
                        }
                    ],
                    "listeners": {}
                }
            }
        }
        beforeEach(() => {
            validateVisInputStub = Sinon.stub(KibanaApiService, 'validateVisInput');
            getWellFormVisStateStub = Sinon.stub(KibanaApiService, 'getWellFormVisState');

        });
        afterEach(() => {
            validateVisInputStub.restore();
            getWellFormVisStateStub.restore();
            stubKibanaApiService.restore();

        });
        it('should call getWellFormVisStateStub', () => {
            let state = {visId: 1, visState: {"title": "vis"}};
            KibanaApiService.createVisByPartialParameters([state]);

            Sinon.assert.calledOnce(getWellFormVisStateStub);

        });
        it('should call validateVisInputStub', () => {
            KibanaApiService.createVisByPartialParameters([""], config);
            Sinon.assert.called(validateVisInputStub);

        });
        it('should not call validateVisInputStub', () => {
            KibanaApiService.createVisByPartialParameters([], config);
            Sinon.assert.callCount(validateVisInputStub, 0);

        });
        // it('should not call createVisByVisState', () => {
        //     stubKibanaApiService = Sinon.stub(KibanaApiService, 'createVisByVisState');
        //     KibanaApiService.createVisByPartialParameters([], config);
        //     Sinon.assert.callCount(stubKibanaApiService, 0);
        //
        // });

    });

    describe('beforeCallElastic function', () => {
        let res;
        beforeEach(() => {

        });
        it('should return array length equal zero', () => {
            res = KibanaApiService["beforeCallElastic"]([]);
            expect(res.length).equal(0)
        });
        it('should return array length equal 1', () => {
            let state = {id: 1, state: {"title": "vis"}};
            res = KibanaApiService["beforeCallElastic"]([state]);
            expect(res.length).equal(1)
        });
    });

    describe('createVisState function', () => {
        let res;
        beforeEach(() => {

        });
        afterEach(() => {

        });
        it('should return object with title field equal "title"', () => {
            res = KibanaApiService["createVisState"]("title", {}, "myIndex");
            expect(res.title).equal("title")
        });
        it('should return object with title visState equal JSON.stringify({a: "abc"})', () => {
            res = KibanaApiService["createVisState"]("title", {a: "abc"}, "myIndex");
            expect(res.visState).equal(JSON.stringify({a: "abc"}))
        });
    });

    describe('getWellFormVisState function', () => {
        let res;
        let config = {
            "visStats": {
                "pie": {
                    "title": "New Visualization",
                    "type": "pie",
                    "params": {
                        "shareYAxis": true,
                        "addTooltip": true,
                        "addLegend": true,
                        "legendPosition": "right",
                        "isDonut": false
                    },
                    "aggs": [
                        {
                            "id": "1",
                            "enabled": true,
                            "type": "count",
                            "schema": "metric",
                            "params": {}
                        },
                        {
                            "id": "2",
                            "enabled": true,
                            "type": "terms",
                            "schema": "segment",
                            "params": {
                                "field": "Region.keyword",
                                "size": 5,
                                "order": "desc",
                                "orderBy": "1"
                            }
                        }
                    ],
                    "listeners": {}
                },
                "histogram": {
                    "title": "New Visualization",
                    "type": "histogram",
                    "params": {
                        "shareYAxis": true,
                        "addTooltip": true,
                        "addLegend": true,
                        "legendPosition": "right",
                        "scale": "linear",
                        "mode": "stacked",
                        "times": [],
                        "addTimeMarker": false,
                        "defaultYExtents": false,
                        "setYExtents": false,
                        "yAxis": {}
                    },
                    "aggs": [
                        {
                            "id": "1",
                            "enabled": true,
                            "type": "count",
                            "schema": "metric",
                            "params": {}
                        },
                        {
                            "id": "2",
                            "enabled": true,
                            "type": "histogram",
                            "schema": "segment",
                            "params": {
                                "field": "azimuth",
                                "interval": 90,
                                "extended_bounds": {}
                            }
                        }
                    ],
                    "listeners": {}
                }
            }
        }

        beforeEach(() => {

        });

        it('should return object with params["shareYAxis"] equal true', () => {
            res = KibanaApiService["getWellFormVisState"]({visState: {visType: "pie", "shareYAxis": true}}, config);
            expect(res.params["shareYAxis"]).equal(true)
        });
        it('should return object with params["addTooltip"] equal true', () => {
            res = KibanaApiService["getWellFormVisState"]({visState: {visType: "pie", "addTooltip": true}}, config);
            expect(res.params["addTooltip"]).equal(true)
        });
        it('should return object with params["addLegend"] equal true', () => {
            res = KibanaApiService["getWellFormVisState"]({visState: {visType: "pie", "addLegend": true}}, config);
            expect(res.params["addLegend"]).equal(true)
        });
        it('should return object with params["legendPosition"] equal "right"', () => {
            res = KibanaApiService["getWellFormVisState"]({
                visState: {
                    visType: "pie",
                    "legendPosition": "right"
                }
            }, config);
            expect(res.params["legendPosition"]).equal("right")
        });
        it('should return object with params["isDonut"] equal true', () => {
            res = KibanaApiService["getWellFormVisState"]({visState: {visType: "pie", "isDonut": true}}, config);
            expect(res.params["isDonut"]).equal(true)
        });
        it('should return object with aggs[1].params["field"] equal "myField"', () => {
            res = KibanaApiService["getWellFormVisState"]({visState: {visType: "pie", "field": "myField"}}, config);
            expect(res.aggs[1].params["field"]).equal("myField")
        });
        it('should return object with aggs[1].params["size"] equal 5', () => {
            res = KibanaApiService["getWellFormVisState"]({
                visState: {visType: "pie", "size": 5}
            }, config);
            expect(res.aggs[1].params["size"]).equal(5)
        });
        it('should return object with aggs[1].params["interval"] equal 5', () => {
            res = KibanaApiService["getWellFormVisState"]({
                visState: {visType: "pie", "interval": 5}
            }, config);
            expect(res.aggs[1].params["interval"]).equal(5)
        });
        it('should return object with aggs[0]["type"] equal "count"', () => {
            res = KibanaApiService["getWellFormVisState"]({
                visState: {visType: "pie", "aggMetricType": "count"}
            }, config);
            expect(res.aggs[0]["type"]).equal("count")
        });
        it('should return object with aggs[1]["type"] equal "terms"', () => {
            res = KibanaApiService["getWellFormVisState"]({
                visState: {visType: "pie", "aggBucketType": "terms"}
            }, config);
            expect(res.aggs[1]["type"]).equal("terms")
        });
    });


});


