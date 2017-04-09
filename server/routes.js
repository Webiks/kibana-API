import _ from 'lodash';
import jsonfile from 'jsonfile';

import path from 'path'

export default function (server) {

    let call = server.plugins.elasticsearch.callWithRequest;


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

        path: '/api/createVis/createVisByVisState',
        method: 'POST',
        handler(req, reply) {

            call(req, 'bulk', {body: createBody(req.payload, server.config().get('kibana.index'))}).then(function (response) {
                reply(response);
            });

        }
    });

};
function createBody(visArr, iKibanaIndex) {
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