'use strict';

var requireRegExp = /(?:[^.]|^)\s*require\s*\(\s*(['"])([^)]+)\1\s*\)/g;
var commentUtil = require('./lib/commentUtil');

function findAll(content) {
  var contentComment = commentUtil.stashJsComments(content);
  content = contentComment.content;
  var ret = [];
  requireRegExp.lastIndex = 0;
  var result;
  while ((result = requireRegExp.exec(content)) != null) {
    ret.push(result[2]);
  }
  return ret;
}

function replaceAll(content, fn) {
  var contentComment = commentUtil.stashJsComments(content);
  content = contentComment.content;
  content = content.replace(requireRegExp, function (match, quote, dep) {
    var leading = match.match(/^(.?\s*)require\s*\(/)[1];
    return leading + fn(match.slice(leading.length), quote, dep);
  });
  return commentUtil.restoreComments(content, contentComment.comments);
}

function splitPackageName(moduleName) {
  var index = moduleName.indexOf('/');
  if (index !== -1) {
    // support domain package
    // require('@ali/matrix')
    if (moduleName.charAt(0) === '@') {
      index = moduleName.indexOf('/', index + 1);
    }
  }
  if (index !== -1) {
    return {
      packageName: moduleName.slice(0, index),
      suffix: moduleName.slice(index)
    };
  } else {
    return {
      packageName: moduleName,
      suffix: ''
    };
  }
}

function startsWith(str, prefix) {
  return str.slice(0, prefix.length) === prefix;
}

module.exports = {
  findAll: findAll,
  replaceAll: replaceAll,
  splitPackageName: splitPackageName,
  isRelativeModule: function (dep) {
    return startsWith(dep, './') || startsWith(dep, '../');
  }
};
