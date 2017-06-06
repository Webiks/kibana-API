/**
 * Created by arbel on 13/12/2016.
 */

import Sinon from "sinon";
import {KibanaApiService} from "../kibana-api-service";
import {expect} from 'chai';


describe('KibanaApiService', () => {
    let stubKibanaApiService;
    let stubGetKibanaDocumentStructure;
    beforeEach(() => {

    });
    afterEach(() => {
        stubKibanaApiService.restore();
        stubGetKibanaDocumentStructure.restore();
    });

    describe('createVisByVisState function', () => {
        beforeEach(() => {

        });
        afterEach(() => {
            stubKibanaApiService.restore();
        });
        it('should call beforeCallElastic because the function accept vis array', () => {
            stubKibanaApiService = Sinon.stub(KibanaApiService, 'beforeCallElastic');
             stubGetKibanaDocumentStructure = Sinon.stub(KibanaApiService, 'getKibanaDocumentStructure').returns([""]);

            let state = {visId: 1, visState: {"title": "vis"}};
            KibanaApiService.createVisByVisState([state]);

            Sinon.assert.calledOnce(stubKibanaApiService);

        });
        it('should not call callElastic because the function accept empty vis array', () => {
            stubKibanaApiService = Sinon.stub(KibanaApiService, 'beforeCallElastic');
            KibanaApiService.createVisByVisState([]);
            Sinon.assert.callCount(stubKibanaApiService, 0);
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
        it('should call getWellFormVisState', () => {
            let state = {visId: 1, visState: {"title": "vis"}};
            KibanaApiService.createVisByPartialParameters([state]);

            Sinon.assert.calledOnce(getWellFormVisStateStub);

        });
        it('should call validateVisInput because the function accept vis array', () => {
            KibanaApiService.createVisByPartialParameters([""], config);
            Sinon.assert.called(validateVisInputStub);

        });
        it('should not call validateVisInput because the function accept empty vis array', () => {
            KibanaApiService.createVisByPartialParameters([], config);
            Sinon.assert.callCount(validateVisInputStub, 0);

        });
        

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
            expect(res[0].id).equal(1)
        });
    });

    describe('getKibanaDocumentStructure function', () => {
        let res;
        beforeEach(() => {

        });
        afterEach(() => {

        });
        it('should return object with title field equal "title"', () => {
            res = KibanaApiService["getKibanaDocumentStructure"]("title", {}, "myIndex");
            expect(res.title).equal("title")
        });
        it('should return object with title visState equal JSON.stringify({a: "abc"})', () => {
            res = KibanaApiService["getKibanaDocumentStructure"]("title", {a: "abc"}, "myIndex");
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

        it('should return the right well form vis state', () => {
			let visState={visType: "pie", "shareYAxis": true,"addTooltip": true,"addLegend": true,"legendPosition": "right",
			"isDonut": true,"field": "myField","size": 5,"interval": 5,"aggMetricType": "count","aggBucketType": "terms"};
            res = KibanaApiService["getWellFormVisState"]({visState: visState}, config);
            expect(res.params["shareYAxis"]).equal(true);
		    expect(res.params["addTooltip"]).equal(true);
			expect(res.params["addLegend"]).equal(true);
		    expect(res.params["legendPosition"]).equal("right");
		    expect(res.params["isDonut"]).equal(true);
			expect(res.aggs[1].params["field"]).equal("myField");
			expect(res.aggs[1].params["size"]).equal(5);
			expect(res.aggs[1].params["interval"]).equal(5);
			expect(res.aggs[0]["type"]).equal("count");
			expect(res.aggs[1]["type"]).equal("terms");
        });     
       
    });


});


