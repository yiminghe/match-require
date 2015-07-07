var expect = require('expect.js');
var matchRequire = require('../../');

describe('match import', function () {
  it('findAllImports works', function () {
    var content = ['// import "2"',
      'import x from "3";',
      'console.import("1")',
      '/* import "2" */',
      'import {z} from "4";'
    ].join('\n');

    var ret = matchRequire.findAllImports(content);

    expect(ret).to.eql(['3', '4']);
  });
});
