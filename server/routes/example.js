export default function (server) {

  server.route({
    path: '/api/kibana_api/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
