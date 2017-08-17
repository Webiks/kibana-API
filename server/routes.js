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
            callWithRequest(req, 'create', getCreateRequest(server.config().get('kibana.index'), 'index-pattern', req.payload))
                .then(function (response) {
                    reply(response);
                })
                .catch(err => {
                    reply({create:false,reason:err.reason});
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

function getCreateRequest(iIndex, iType, iBody) {

    return {
        index: iIndex,
        type: iType,
        body: iBody,
        id: iBody.title
    };
}