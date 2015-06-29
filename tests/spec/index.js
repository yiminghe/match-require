var expect = require('expect.js');
var matchRequire = require('../../');

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

  describe('replaceAll', function () {
    it('works', function () {
      var content = 'require("2")';
      var ret = [];
      var content2 = matchRequire.replaceAll(content, function (match, quote, dep) {
        ret.push([match, quote, dep]);
        return match;
      });
      expect(content2).to.be(content);
      expect(ret).to.eql([['require("2")', '"', '2']]);
    });


    it('works complex', function () {
      var content = ['// require("2")',
        'require("3");',
        'console.require("1")',
        '/* require("2") */',
        'require("4")'
      ].join('\n');

      var ret = [];

      var content2 = matchRequire.replaceAll(content, function (match, quote, dep) {
        ret.push([match, quote, dep]);
        return match;
      });

      expect(ret).to.eql([['require("3")', '"', '3'], ['require("4")', '"', '4']]);
    });
  });

});
