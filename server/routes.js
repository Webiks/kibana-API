import _ from 'lodash';
import jsonfile from 'jsonfile';
import packageJson from '../package.json';
import request from 'request'
import path from 'path'
import Q from 'q';

const kibanaVersion = packageJson.kibana.version;


export default function (server) {

    const elastic = server.plugins.elasticsearch;
    let callWithRequest;

    if (elastic["callWithRequest"]) {
        callWithRequest = elastic.callWithRequest;
    }
    else {
        callWithRequest = elastic.getCluster('data').callWithRequest;
    }


    server.route({

        path: '/api/visStructure',
        method: 'GET',
        handler(req, h) {

            var file = __dirname + '/visStruct.json';

            return new Promise((resolve, reject) => {
                jsonfile.readFile(file, (err, obj) => {
                    if(err)
                        reject(err);
                    else
                        resolve(obj);
                });

            })
        }
    });


    server.route({

        path: '/api/getIndexPatternId',
        method: 'POST',
        handler(req, h) {
            return getIndexPatternId(req);
        }
    });


    server.route({

        path: '/api/createVis/createVisByVisState',
        method: 'POST',
        handler(req, h) {

            return callWithRequest(req, 'bulk', {body: getBulkBody(req.payload, server.config().get('kibana.index'))});

        }
    });

    server.route({

        path: '/api/createIndexPattern',
        method: 'POST',
        handler(req, h) {
            return getIndexPatternId(req)
            .then((indexPattern) => {
                if (indexPattern.length == 0) {
                    let options = {
                        headers: {'content-type': 'application/json', 'kbn-version': getKibanVersion()},
                        url: req.headers.referer.split('app')[0] + 'api/saved_objects/index-pattern',
                        json: {attributes: {timeFieldName: req.payload.timeFieldName, title: req.payload.title}}
                    };
                    return new Promise((resolve, reject) => {
                        request.post(options, function (error, response, body) {
                            try {
                                if (error) {
                                    console.log(error);
                                    reject(error);
                                }
                                else {
                                    resolve(body);
                                }
                            } catch (e) {
                                console.log(e);
                                return reject(e);
    
                            }
                        });
                    });
                }
                else {
                    return Promise.resolve({});
                }
            })
        }
    });

    server.route({

        path: '/api/setIndexPattern',
        method: 'POST',
        handler(req, h) {
            return getIndexPatternId(req).then((indexPattern) => {
                let urlHeader = req.headers.referer.split('app')[0] + 'api/';
                let url = urlHeader + 'kibana/settings/defaultIndex';
                let options = {
                    headers: {'content-type': 'application/json', 'kbn-version': getKibanVersion()},
                    url: url,
                    json: {value: indexPattern[0].id}
                };
                return new Promise((resolve, reject) => {
                    request.post(options, function (error, response, body) {
                        if (error) {
                            console.log(error);
                            reject(error);
                        }
                        console.log(body);
    
                        resolve(body);
    
                    });
                });
            });

        }
    });

};

function getIndexPatternId(iReq) {
    let deferred = Q.defer();

    let urlHeader = iReq.headers.referer.split('app')[0] + 'api/saved_objects';
    let urlMiddle = iReq.payload.title ? '&search="' + iReq.payload.title + '"&search_fields=title&' : '&';
    let url = urlHeader + '/_find?type=index-pattern' + urlMiddle + 'fields=title';
    request.get(url, function (error, response, body) {
        if (error) {
            console.log(error);
            deferred.resolve(error)
        }
        let res = JSON.parse(body);
        deferred.resolve(res.saved_objects)

    });
    return deferred.promise;

}

function getBulkBody(visArr, iKibanaIndex) {
    let bodyArr = [];
    let type = 'visualization';
    if (isKibanaSix()) {
        type = "doc";
    }
    _.forEach(visArr, function (vis) {
        bodyArr.push({
            index: {
                "_index": iKibanaIndex,
                "_type": type,
                "_id": vis.id
            }
        })
        bodyArr.push(vis.body);

    })
    return bodyArr;
}

function isKibanaSix() {
    return Number(getKibanVersion().split('.')[0]) == 6;
}

function getKibanVersion() {
    return kibanaVersion.split('-')[0];
}

function msearchIndexPatternBody(iKibanaIndex, iType, iTitels) {
    let bodyArr = [];
    let type = iType;
    let query = {};
    if (isKibanaSix()) {
        type = "doc";
    }
    _.forEach(iTitels, function (title) {
        query = {
            query: {
                match: {
                    title: title
                }
            }
        };
        if (isKibanaSix()) {
            query = {
                query: {
                    match: {
                        "index-pattern.title": title
                    }
                }
            }
        }
        bodyArr.push({
                "_index": iKibanaIndex,
                "_type": type
            }, query
        )
    });
    return bodyArr;
}

function getCreateRequest(iIndex, iType, iBody, iID) {
    let oRequest = {
        index: iIndex,
        type: iType,
        body: iBody
    };
    if (iID) {
        oRequest["id"] = iID
    }

    return oRequest
}