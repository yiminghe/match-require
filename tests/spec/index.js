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

    it('keep line number',function(){
      var content = 'require(\n\n"2"\n)';
      var content2 = matchRequire.replaceAll(content, function (match, quote, dep) {
        return 'window.x';
      });
      expect(content2).to.be('window.x\n\n\n');
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

  describe('splitPackageName',function(){
    it('works for xx',function(){
      var name ='xx';
      expect(matchRequire.splitPackageName(name)).to.eql({
        packageName:'xx',
        suffix:''
      });
    });

    it('works for xx/yy',function(){
      var name ='xx/yy';
      expect(matchRequire.splitPackageName(name)).to.eql({
        packageName:'xx',
        suffix:'/yy'
      });
    });

    it('works for @xx/yy',function(){
      var name ='@xx/yy';
      expect(matchRequire.splitPackageName(name)).to.eql({
        packageName:'@xx/yy',
        suffix:''
      });
    });

    it('works for @xx/yy/zz',function(){
      var name ='@xx/yy/zz';
      expect(matchRequire.splitPackageName(name)).to.eql({
        packageName:'@xx/yy',
        suffix:'/zz'
      });
    });
  });

  describe('isRelativeModule',function(){
    it('works for xx',function(){
      expect(matchRequire.isRelativeModule('xx')).to.be(false);
    });

    it('works for ../x',function(){
      expect(matchRequire.isRelativeModule('../xx')).to.be(true);
    });

    it('works for ./x',function(){
      expect(matchRequire.isRelativeModule('./xx')).to.be(true);
    });
  });
});
