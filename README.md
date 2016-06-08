# match-require

[![NPM version](https://nodei.co/npm/match-require.png)](https://npmjs.org/package/match-require)
[![NPM downloads](http://img.shields.io/npm/dm/match-require.svg)](https://npmjs.org/package/match-require)
[![Build Status](https://travis-ci.org/yiminghe/match-require.svg?branch=master)](https://travis-ci.org/yiminghe/match-require)
[![Coverage Status](https://coveralls.io/repos/yiminghe/match-require/badge.svg?branch=master)](https://coveralls.io/r/yiminghe/match-require?branch=master)

find require or import calls from string using regexp

## examples

```js
var expect = require('expect.js');
var matchRequire = require('match-require');

describe('match require', function () {
  it('findAll works', function () {
    var content = ['// require("2")',
      'require("3");',
      'console.require("1")',
      '/* require("2") */',
      'require("4")'
    ].join('\n');

    var ret = matchRequire.findAll(content);

    expect(ret).to.eql(['3', '4']);
  });

  it('findAllImports works', function () {
      var content = ['// import "2"',
        'import x from "3";',
        '/* import "2" */',
        'import {z} from "4";'
      ].join('\n');

      var ret = matchRequire.findAll(content);

      expect(ret).to.eql(['3', '4']);
    });
});

```
