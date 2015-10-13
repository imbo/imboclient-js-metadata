'use strict';

var request = require('imboclient').Client.request;
var ImboQuery = require('imboclient').Query;

/**
 * Build the query object used to build the URI string
 *
 * @param {Object} opts - Metadata query options
 * @param {bool} globalSearch - Whether we're searching globally or not
 * @return {Query}
 */
function buildQuery(opts, globalSearch) {
    var imboQuery = new ImboQuery();

    imboQuery.page(opts.page);
    imboQuery.limit(opts.limit);

    if (opts.users && globalSearch) {
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
        user: null,
        query: buildQuery(opts, true).toString()
    });

    request({
        method: 'SEARCH',
        uri: searchEndpointUrl.toString(),
        json: query,
        header: {
            'User-Agent': 'imboclient-js'
        },
        onComplete: function(err, res, body) {
            callback(
                err,
                body ? body.images : [],
                body ? body.search : {},
                res
            );
        }
    });

    return true;
}

/**
 * Search for images from a given user using metadata
 *
 * @param {String} user - User to search for images from
 * @param {Object} query - Metadata search query
 * @param {Object} opts - Metadata query options
 * @param {Function} callback - Function to call with the search result
 * @return {boolean}
 * @this ImboClient
 */
function searchMetadata(user, query, opts, callback) {
    if (typeof opts === 'function' && !callback) {
        callback = opts;
        opts = {};
    }

    var searchEndpointUrl = this.getResourceUrl({
        path: '/users/' + user + '/images',
        user: user,
        query: buildQuery(opts).toString()
    });

    request({
        method: 'SEARCH',
        uri: searchEndpointUrl.toString(),
        json: query,
        header: {
            'User-Agent': 'imboclient-js'
        },
        onComplete: function(err, res, body) {
            callback(
                err,
                body ? body.images : [],
                body ? body.search : {},
                res
            );
        }
    });

    return true;
}

exports.searchMetadata = searchMetadata;
exports.searchGlobalMetadata = searchGlobalMetadata;
