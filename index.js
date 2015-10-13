'use strict';

var request = require('request');
var MetadataQuery = require('./lib/query');

/**
 * Build the query object used to build the URI string
 *
 * @param {Object} opts - Metadata query options
 * @return {Query}
 */
function buildQuery(opts) {
    var imboQuery = new MetadataQuery();

    imboQuery.page(opts.page);
    imboQuery.limit(opts.limit);

    if (opts.users) {
        imboQuery.users(opts.users);
    }

    if (opts.fields) {
        imboQuery.fields(opts.fields);
    }

    if (opts.sort) {
        imboQuery.addSorts(opts.sort);
    }

    if (opts.metadata) {
        imboQuery.metadata(opts.metadata);
    }

    return imboQuery;
}

/**
 * Search globally for images using metadata
 *
 * @param {Object} query - Metadata search query
 * @param {Object} opts - Metadata query options
 * @param {Function} callback - Function to call with the search result
 * @return {boolean}
 * @this ImboClient
 */
function searchGlobalMetadata(query, opts, callback) {
    if (typeof opts === 'function' && !callback) {
        callback = opts;
        opts = {};
    }

    var searchEndpointUrl = this.getResourceUrl({
        path: '/images',
        query: buildQuery(opts).toString()
    });

    request({
        method: 'SEARCH',
        uri: searchEndpointUrl.toString(),
        json: query,
        header: {
            'User-Agent': 'imboclient-js'
        }
    }, function(err, res, body) {
        callback(
            err,
            body ? body.images : [],
            body ? body.search : {},
            res
        );
    });

    return true;
}

// exports.searchUserMetadata = searchMetadata;
exports.searchGlobalMetadata = searchGlobalMetadata;
