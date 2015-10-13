# Metadata search client addon
An addon for the JS `imboclient`.

## Installation
imboclient-js-metadata can be installed using [npm](https://npmjs.org/) or [bower](http://bower.io/):

```
# NPM:
npm install imboclient-metadata

# Bower:
bower install imboclient-metadata
```

## Basic usage
There is no clearly defined add-on or plugin concept in the `imboclient`, but this add-on is written in a way that requires you to add the functions it exports to the Imbo.Client prototype for it to work. Exactly how you want to do this is up to you.

```javascript
var Imbo = require('imboclient');
var searchGlobalMetadata = require('../index').searchGlobalMetadata;

// Add method to prototype
Imbo.Client.prototype.searchGlobalMetadata = searchGlobalMetadata;

// Instantiate client
client = new Imbo.Client('http://imbo', 'foobar', 'barfoo'),

// Search for cat images using metadata
client.searchGlobalMetadata(
    { animal: 'cat' },
    { users: ['user', 'other-user']},
    function(err, body, meta, res) {
        console.log(err, body, meta);
    }
);
```

## License
Copyright (c) 2015, Kristoffer Brabrand <kristoffer@brabrand.no>

Licensed under the MIT License
