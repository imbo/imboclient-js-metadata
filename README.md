[![npm version](http://img.shields.io/npm/v/imboclient-metadata.svg?style=flat-square)](http://browsenpm.org/package/imboclient-js-metadata)[![Build Status](http://img.shields.io/travis/imbo/imboclient-js-metadata/master.svg?style=flat-square)](https://travis-ci.org/imbo/imboclient-js-metadata)[![Dependency status](https://img.shields.io/david/imbo/imboclient-js-metadata.svg?style=flat-square)](https://david-dm.org/imbo/imboclient-js-metadata)

# Metadata search client addon
An addon for the Imbo [javascript client](https://github.com/imbo/imboclient-js). It provides the functions needed to query an [Imbo](https://github.com/imbo/imbo) installation set up with the [metadata search extension](https://github.com/imbo/imbo-metadata-search).

## Installation
Given that you've set up Imbo with the metadata search all you need to do is to install `imboclient-metadata` using [npm](https://npmjs.org/):

```sh
npm install imboclient-metadata
```

## Basic usage
There is no clearly defined add-on or plugin concept in the `imboclient`, but this add-on is written in a way that requires you to add the functions it exports to the Imbo.Client prototype for it to work. Exactly how you want to do this is up to you.

```javascript
'use strict';

var Imbo = require('imboclient');
var metadata = require('imboclient-metadata');

// Add method to prototype
Imbo.Client.prototype.searchMetadata = metadata.searchMetadata;
Imbo.Client.prototype.searchGlobalMetadata = metadata.searchGlobalMetadata;

// Instantiate client
var client = new Imbo.Client('http://imbo', 'foobar', 'barfoo');

// Search for cat images using metadata across user and other-user
client.searchGlobalMetadata(
    // The metadata query to perform
    { animal: 'cat' },

    // Options
    {
        users: ['user', 'other-user'],

        // Whether to include metadata for images in response or not
        metadata: 1,

        // Which fields to return
        fields: ['width', 'height', 'imageIdentifer'],

        // Sort order of result set. Default is ordering from metadata backend
        sort: ['width:asc', 'height:desc']
    },

    function(err, body, meta, res) {
        console.log(err, body, meta);
    }
);

// Search for cat images using metadata across user and other-user
client.searchMetadata(
    // The user to search for images from
    'user',

    // The metadata query to perform
    { animal: 'cat' },

    // Options are the same as with searchGlobalMetadata, minus the users option
    {},

    function(err, body, meta, res) {
        console.log(err, body, meta);
    }
);
```

## License
Copyright (c) 2015, Kristoffer Brabrand <kristoffer@brabrand.no>

Licensed under the MIT License
