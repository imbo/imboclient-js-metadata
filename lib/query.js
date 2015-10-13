'use strict';

var ImboQuery = require('imboclient/lib/query');
var inherits = require('util').inherits;

function MetadataQuery() {
    ImboQuery.call(this);
}

inherits(MetadataQuery, ImboQuery);

MetadataQuery.prototype.users = function(users) {
    return this.setOrGet('user', users);
};

/**
 * @inheritdoc
 */
MetadataQuery.prototype.toQueryString = function() {
    var query = ImboQuery.prototype.toQueryString.call(this);

    (this.setOrGet('user') || []).forEach(function(user) {
        query += '&user[]=' + user;
    });

    return query;
};

module.exports = MetadataQuery;
