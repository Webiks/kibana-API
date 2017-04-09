import {resolve} from 'path';
import api from './server/routes';

export default function (kibana) {
    return new kibana.Plugin({
        require: ['elasticsearch'],

        uiExports: {

            app: {
                title: 'Kibana Api',
                description: 'This plugin allow you to crete visualization dynamiclly',
                main: 'plugins/kibana_api/app'
            },


            hacks: [
                'plugins/kibana_api/hack'
            ]

        },

        config(Joi) {
            return Joi.object({
                enabled: Joi.boolean().default(true),
            }).default();
        },


        init(server, options) {
            api(server);
        }


    });
};
