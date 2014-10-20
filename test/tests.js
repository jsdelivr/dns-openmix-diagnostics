(function() {
    'use strict';

    var default_settings;

    default_settings = {
        providers: [ 'a', 'b', 'c' ]
    };

    module('do_init');

    function test_do_init(i) {
        return function() {

            var sut,
                config = {
                    requireProvider: this.stub()
                },
                test_stuff = {
                    config: config
                };

            sut = new OpenmixApplication(default_settings);

            i.setup(test_stuff);

            // Test
            sut.do_init(config);

            // Assert
            i.verify(test_stuff);
        };
    }

    test('init', test_do_init({
        setup: function() {
        },
        verify: function(i) {
            equal(i.config.requireProvider.callCount, 3);
            equal(i.config.requireProvider.args[0][0], 'a');
            equal(i.config.requireProvider.args[1][0], 'b');
            equal(i.config.requireProvider.args[2][0], 'c');
        }
    }));

    module('handle_request');

    function test_handle_request(i) {
        return function() {
            var sut,
                request = {
                    getProbe: this.stub(),
                    getData: this.stub()
                },
                response = {
                    addCName: this.stub(),
                    setTTL: this.stub()
                },
                test_stuff = {
                    request: request,
                    response: response
                };

            sut = new OpenmixApplication(default_settings);

            i.setup(test_stuff);

            // Test
            sut.handle_request(request, response);

            // Assert
            i.verify(test_stuff);
        };
    }

    test('default', test_handle_request({
        setup: function(i) {
            i.request.market = 'AS';
            i.request.country = 'JP';
            i.request.asn = 1234;
            i.request.hostname_prefix = '';
            i.request
                .getProbe
                .withArgs('avail')
                .returns({
                    'a': {
                        'avail': 99
                    },
                    'b': {
                        'avail': 100
                    },
                    'c': {
                        'avail': 100
                    }
                });
            i.request
                .getProbe
                .withArgs('http_rtt')
                .returns({
                    'a': {
                        'http_rtt': 199
                    },
                    'b': {
                        'http_rtt': 201
                    },
                    'c': {
                        'http_rtt': 202
                    }
                });
            i.request
                .getData
                .withArgs('sonar')
                .returns({
                    'a': '1.00000',
                    'b': '1.00000',
                    'c': '1.00000'
                });
        },
        verify: function(i) {
            equal(i.response.addCName.args[0][0], 'AS.JP.1234.placeholder.example.com', 'Verifying CNAME');
            equal(i.response.setTTL.args[0][0], 20, 'Verifying TTL');
        }
    }));

    test('default', test_handle_request({
        setup: function(i) {
            i.request.market = 'AS';
            i.request.country = 'JP';
            i.request.asn = 1234;
            i.request.hostname_prefix = undefined;
            i.request
                .getProbe
                .withArgs('avail')
                .returns({
                    'a': {
                        'avail': 99
                    },
                    'b': {
                        'avail': 100
                    },
                    'c': {
                        'avail': 100
                    }
                });
            i.request
                .getProbe
                .withArgs('http_rtt')
                .returns({
                    'a': {
                        'http_rtt': 199
                    },
                    'b': {
                        'http_rtt': 201
                    },
                    'c': {
                        'http_rtt': 202
                    }
                });
            i.request
                .getData
                .withArgs('sonar')
                .returns({
                    'a': '1.00000',
                    'b': '1.00000',
                    'c': '1.00000'
                });
        },
        verify: function(i) {
            equal(i.response.addCName.args[0][0], 'AS.JP.1234.placeholder.example.com', 'Verifying CNAME');
            equal(i.response.setTTL.args[0][0], 20, 'Verifying TTL');
        }
    }));

    test('default; no data', test_handle_request({
        setup: function(i) {
            i.request.market = 'AS';
            i.request.country = 'JP';
            i.request.asn = 1234;
            i.request.hostname_prefix = '';
            i.request
                .getProbe
                .withArgs('avail')
                .returns({
                    'a': {},
                    'b': {},
                    'c': {}
                });
            i.request
                .getProbe
                .withArgs('http_rtt')
                .returns({
                    'a': {},
                    'b': {},
                    'c': {}
                });
            i.request
                .getData
                .withArgs('sonar')
                .returns({});
        },
        verify: function(i) {
            equal(i.response.addCName.args[0][0], 'AS.JP.1234.placeholder.example.com', 'Verifying CNAME');
            equal(i.response.setTTL.args[0][0], 20, 'Verifying TTL');
        }
    }));

    test('a.http-rtt', test_handle_request({
        setup: function(i) {
            i.request.market = 'AS';
            i.request.country = 'JP';
            i.request.asn = 1234;
            i.request.hostname_prefix = 'a.http-rtt';
            i.request
                .getProbe
                .withArgs('avail')
                .returns({
                    'a': {
                        'avail': 99
                    },
                    'b': {
                        'avail': 100
                    },
                    'c': {
                        'avail': 100
                    }
                });
            i.request
                .getProbe
                .withArgs('http_rtt')
                .returns({
                    'a': {
                        'http_rtt': 199
                    },
                    'b': {
                        'http_rtt': 201
                    },
                    'c': {
                        'http_rtt': 202
                    }
                });
            i.request
                .getData
                .withArgs('sonar')
                .returns({
                    'a': '1.00000',
                    'b': '1.00000',
                    'c': '1.00000'
                });
        },
        verify: function(i) {
            equal(i.response.addCName.args[0][0], 'AS.JP.1234.a.http-rtt.199.example.com', 'Verifying CNAME');
            equal(i.response.setTTL.args[0][0], 20, 'Verifying TTL');
        }
    }));

    test('c.avail', test_handle_request({
        setup: function(i) {
            i.request.market = 'AS';
            i.request.country = 'JP';
            i.request.asn = 1234;
            i.request.hostname_prefix = 'c.avail';
            i.request
                .getProbe
                .withArgs('avail')
                .returns({
                    'a': {
                        'avail': 99
                    },
                    'b': {
                        'avail': 100
                    },
                    'c': {
                        'avail': 100
                    }
                });
            i.request
                .getProbe
                .withArgs('http_rtt')
                .returns({
                    'a': {
                        'http_rtt': 199
                    },
                    'b': {
                        'http_rtt': 201
                    },
                    'c': {
                        'http_rtt': 202
                    }
                });
            i.request
                .getData
                .withArgs('sonar')
                .returns({
                    'a': '1.00000',
                    'b': '1.00000',
                    'c': '1.00000'
                });
        },
        verify: function(i) {
            equal(i.response.addCName.args[0][0], 'AS.JP.1234.c.avail.100.example.com', 'Verifying CNAME');
            equal(i.response.setTTL.args[0][0], 20, 'Verifying TTL');
        }
    }));

    test('a.sonar', test_handle_request({
        setup: function(i) {
            i.request.market = 'AS';
            i.request.country = 'JP';
            i.request.asn = 1234;
            i.request.hostname_prefix = 'a.sonar';
            i.request
                .getProbe
                .withArgs('avail')
                .returns({
                    'a': {
                        'avail': 99
                    },
                    'b': {
                        'avail': 100
                    },
                    'c': {
                        'avail': 100
                    }
                });
            i.request
                .getProbe
                .withArgs('http_rtt')
                .returns({
                    'a': {
                        'http_rtt': 199
                    },
                    'b': {
                        'http_rtt': 201
                    },
                    'c': {
                        'http_rtt': 202
                    }
                });
            i.request
                .getData
                .withArgs('sonar')
                .returns({
                    'a': '1.00000',
                    'b': '1.00000',
                    'c': '1.00000'
                });
        },
        verify: function(i) {
            equal(i.response.addCName.args[0][0], 'AS.JP.1234.a.sonar.1-00000.example.com', 'Verifying CNAME');
            equal(i.response.setTTL.args[0][0], 20, 'Verifying TTL');
        }
    }));

}());
