'use strict';

var assert = require('assert');
var url = require('url');

var Imbo = require('imboclient');
var metadata = require('..');

var Client = Imbo.Client;

Client.prototype.searchMetadata = metadata.searchMetadata;
Client.prototype.searchGlobalMetadata = metadata.searchGlobalMetadata;

var signatureCleaner = function(urlPath) {
    return (urlPath
        .replace(/accessToken=[^&]*&?/, '')
        .replace(/page=[^&]*&?/, '')
        .replace(/limit=[^&]*&?/, '')
        .replace(/fields\[\]=[^&]*&?/g, '')
        .replace(/users\[\]=[^&]*&?/g, '')
        .replace(/metadata=[^&]*&?/, '')
        .replace(/publicKey=[^&]*&?/, '')
        .replace(/[?&]$/g, '')
    );
};

require('should');

var client, mock;

describe('Metadata search', function() {
    before(function() {
        client = new Client('http://imbo', 'pub', 'priv');
    });

    beforeEach(function() {
        mock = getNock()('http://imbo');
    });

    afterEach(function() {
        mock.done();
    });

    describe('#searchMetadata()', function() {
        it('shoud request the correct url with the query', function(done) {
            var query = { animal: 'cat' };
            var opts = {
                page: 2,
                limit: 1,
                fields: ['a', 'b'],
                metadata: 1,
                users: ['foo', 'bar']
            };

            mock.filteringPath(signatureCleaner)
                .intercept('/users/user/images', 'SEARCH')
                .reply(200);

            client.searchMetadata('user', query, opts, function(err, body, meta, res) {
                var urlInfo = url.parse(res.request.href, true);

                urlInfo.query.should.have.property('page', String(opts.page));
                urlInfo.query.should.have.property('limit', String(opts.limit));
                urlInfo.query.should.have.property('fields[]', opts.fields);
                urlInfo.query.should.have.property('metadata', String(opts.metadata));

                // Users should not make it into the url
                urlInfo.query.should.not.have.property('users');

                assert(!err);
                assert.deepEqual(JSON.stringify(query), res.request.body);
                assert.equal(200, res.statusCode);

                done();
            });
        });

        it('should return error on a 400-response', function(done) {
            mock.filteringPath(signatureCleaner)
                .intercept('/users/user/images', 'SEARCH')
                .reply(400);

            client.searchMetadata('user', {}, {}, function(err) {
                assert.equal(400, err.statusCode);
                done();
            });
        });
    });

    describe('#searchGlobalMetadata()', function() {
        it('shoud request the correct url with the query', function(done) {
            var query = { animal: 'cat' };
            var opts = {
                page: 2,
                limit: 1,
                fields: ['a', 'b'],
                metadata: 1,
                users: ['foo', 'bar']
            };

            mock.filteringPath(signatureCleaner)
                .intercept('/images', 'SEARCH')
                .reply(200);

            client.searchGlobalMetadata(query, opts, function(err, body, meta, res) {
                var urlInfo = url.parse(res.request.href, true);

                urlInfo.query.should.have.property('page', String(opts.page));
                urlInfo.query.should.have.property('limit', String(opts.limit));
                urlInfo.query.should.have.property('fields[]', opts.fields);
                urlInfo.query.should.have.property('metadata', String(opts.metadata));
                urlInfo.query.should.have.property('users[]', opts.users);

                assert(!err);
                assert.deepEqual(JSON.stringify(query), res.request.body);
                assert.equal(200, res.statusCode);

                done();
            });
        });

        it('should return error on a 400-response', function(done) {
            mock.filteringPath(signatureCleaner)
                .intercept('/images', 'SEARCH')
                .reply(400);

            client.searchGlobalMetadata({}, {}, function(err) {
                assert.equal(400, err.statusCode);
                done();
            });
        });
    });
});

function getNock() {
    return require('nock');
}
