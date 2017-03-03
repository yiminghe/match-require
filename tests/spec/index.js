var expect = require('expect.js');
var matchRequire = require('../../src');

describe('match require', function () {
  it('findAll works', function () {
    var content = ['// require("2")',
      'require("3");',
      '/* require("2") */',
      'require("4")'
    ].join('\n');

    var ret = matchRequire.findAll(content);

    expect(ret).to.eql(['3', '4']);
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
