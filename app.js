
var handler = new OpenmixApplication({
    // The list of provider aliases that you want diagnosed
    providers: [  'cloudflare', 'maxcdn', 'keycdn', 'tm-mg' ]
});

/** @constructor */
function OpenmixApplication(settings) {
    'use strict';

    /** @param {OpenmixConfiguration} config */
    this.do_init = function(config) {
        var i;
        for (i = 0; i < settings.providers.length; i += 1) {
            config.requireProvider(settings.providers[i]);
        }
    };

    /**
     * @param {OpenmixRequest} request
     * @param {OpenmixResponse} response
     */
    this.handle_request = function(request, response) {

        var data = {},
            sonar,
            i,
            temp,
            hostname_prefix_parts,
            cname_parts = [];

        i = settings.providers.length;
        while (i--) {
            data[settings.providers[i]] = {};
        }

        join_objects(data, request.getProbe('avail'), 'avail');
        join_objects(data, request.getProbe('http_rtt'), 'http_rtt');
        //console.log(data);
        sonar = request.getData('sonar');
        //console.log(sonar);
        for (i in sonar) {
           data[i].sonar = sonar[i];
        }


        cname_parts.push(request.market);
        cname_parts.push(request.country);
        cname_parts.push(request.asn);

        if ('xx' === request.hostname_prefix
            || null === request.hostname_prefix
            || 'undefined' === typeof request.hostname_prefix
            || '' === request.hostname_prefix) {
            cname_parts.push('placeholder');
        } else {
            //console.log(request.hostname_prefix);
            hostname_prefix_parts = request.hostname_prefix.split('.');
            cname_parts.push(hostname_prefix_parts[0]);
            cname_parts.push(hostname_prefix_parts[1]);
            hostname_prefix_parts[1] = hostname_prefix_parts[1].replace('-', '_');
            // //console.log(hostname_prefix_parts);
            temp = data[hostname_prefix_parts[0]][hostname_prefix_parts[1]];
            if ('string' === typeof temp) {
                temp = temp.replace(/[\._]/, '-');
            }
            cname_parts.push(temp);
        }

        cname_parts.push('example');
        cname_parts.push('com');
        response.addCName(cname_parts.join('.'));
        response.setTTL(20);
    };

    function join_objects(target, source, property) {
        var i;
        for (i in source) {
            if (property in source[i]) {
                target[i][property] = source[i][property];
            }
        }
    }
}

function init(config) {
    'use strict';
    handler.do_init(config);
}

function onRequest(request, response) {
    'use strict';
    handler.handle_request(request, response);
}
