import _ from 'lodash';
import jsonfile from 'jsonfile';

import path from 'path'

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
        handler(req, reply) {

            var file = __dirname + '/visStruct.json';
            jsonfile.readFile(file, function (err, obj) {
                if (err)
                    console.dir(err)
                reply(obj);

            })

        }
    });


    server.route({

        path: '/api/getIndexPatternId',
        method: 'POST',
        handler(req, reply) {
            callWithRequest(req, 'msearch', {
                body: msearchIndexPatternBody(server.config().get('kibana.index'), 'index-pattern', req.payload)
            }).then(function (response) {
                    try {
                        reply(response.responses);
                    } catch (e) {
                        reply(false);
                    }
                },
                function (error) {
                    console.log(error)
                    reply(false);
                }
            );

        }
    });

    server.route({

        path: '/api/isIndexPatternExist/{id}',
        method: 'GET',
        handler(req, reply) {

            callWithRequest(req, 'get', {
                index: server.config().get('kibana.index'),
                type: 'index-pattern',
                id: req.params.id
            }).then(function (response) {
                    reply(response.found);
                },
                function (error) {
                    reply(false);
                }
            );

        }
    });

    server.route({

        path: '/api/createVis/createVisByVisState',
        method: 'POST',
        handler(req, reply) {

            callWithRequest(req, 'bulk', {body: getBulkBody(req.payload, server.config().get('kibana.index'))}).then(function (response) {
                    reply(response);
                },
                function (error) {
                    reply(error);
                }
            );

        }
    });

    server.route({

        path: '/api/createIndexPattern',
        method: 'POST',
        handler(req, reply) {
            callWithRequest(req, 'create', getCreateRequest(server.config().get('kibana.index'), 'index-pattern', req.payload, req.payload.title))
                .then(function (response) {
                    reply(response);
                })
                .catch(err => {
                    reply({create: false, reason: err.reason});
                });

        }
    });

    server.route({

        path: '/api/setIndexPattern',
        method: 'POST',
        handler(req, reply) {
            callWithRequest(req, 'index', getCreateRequest(server.config().get('kibana.index'), 'config', req.payload.body, req.payload.id))
                .then(function (response) {
                    reply(response);
                })
                .catch(err => {
                    reply({create: false, reason: err.reason});
                });

        }
    });

};

function getBulkBody(visArr, iKibanaIndex) {
    let bodyArr = [];
    _.forEach(visArr, function (vis) {
        bodyArr.push({
            index: {
                "_index": iKibanaIndex,
                "_type": 'visualization',
                "_id": vis.id
            }
        })
        bodyArr.push(vis.body);

    })
    return bodyArr;
}

function msearchIndexPatternBody(iKibanaIndex, iType, iTitels) {
    let bodyArr = [];
    _.forEach(iTitels, function (title) {
        bodyArr.push({
                "_index": iKibanaIndex,
                "_type": iType
            },
            {
                query: {
                    match: {
                        title: title
                    }
                }
            }
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