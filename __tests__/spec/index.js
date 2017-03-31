'use strict';

const matchRequire = require('../../src');

describe('match require', () => {
  it('findAll works', () => {
    const content = ['// require("2")',
      'require("3");',
      '/* require("2") */',
      'require("4")'
    ].join('\n');

    const ret = matchRequire.findAll(content);

    expect(ret).toEqual(['3', '4']);
  });

  it('replaceAll works', () => {
    const content = ['// require("2")',
      'require("3");',
      '/* require("2") */',
      'require("4")'
    ].join('\n');

    const ret = matchRequire.replaceAll(content, (dep) => {
      return dep === '4' ? '5' : dep;
    });

    expect(ret).toEqual([
      'require("3");',
      '',
      'require("5")'
    ].join('\n'));
  });

  it('import works', () => {
    const content = ['// import "2"',
      'import x from "3";',
      'console.import("1")',
      '/* import "2" */',
      'import {z} from "4";',
      `import {
 x,
 y,
 z,
} from "5";`,
    ].join('\n');

    const ret = matchRequire.findAll(content);

    expect(ret).toEqual(['3', '4', '5']);
  });

  describe('splitPackageName', () => {
    it('works for xx', () => {
      const name = 'xx';
      expect(matchRequire.splitPackageName(name)).toEqual({
        packageName: 'xx',
        suffix: ''
      });
    });

    it('works for xx/yy', () => {
      const name = 'xx/yy';
      expect(matchRequire.splitPackageName(name)).toEqual({
        packageName: 'xx',
        suffix: '/yy'
      });
    });

    it('works for @xx/yy', () => {
      const name = '@xx/yy';
      expect(matchRequire.splitPackageName(name)).toEqual({
        packageName: '@xx/yy',
        suffix: ''
      });
    });

    it('works for @xx/yy/zz', () => {
      const name = '@xx/yy/zz';
      expect(matchRequire.splitPackageName(name)).toEqual({
        packageName: '@xx/yy',
        suffix: '/zz'
      });
    });
  });

  describe('isRelativeModule', () => {
    it('works for xx', () => {
      expect(matchRequire.isRelativeModule('xx')).toBe(false);
    });

    it('works for ../x', () => {
      expect(matchRequire.isRelativeModule('../xx')).toBe(true);
    });

    it('works for ./x', () => {
      expect(matchRequire.isRelativeModule('./xx')).toBe(true);
    });
  });
});
