'use strict';

var requireRegExp = /(?:[^.]|^)\s*require\s*\((\s*(['"])[^)'"]+\2\s*)\)/g;
var importRegExp = /(?:[^.]|^)\s*import[^'"\r\n]+(['"])([^'"]+)\1\s*;/g;
var commentUtil = require('./lib/commentUtil');

function repeat(s, n) {
  var ret = '';
  for (var i = 0; i < n; i++) {
    ret += s;
  }
  return ret;
}

function findAll(content) {
  var contentComment = commentUtil.stashJsComments(content);
  content = contentComment.content;
  var ret = [];
  requireRegExp.lastIndex = 0;
  var result;
  while ((result = requireRegExp.exec(content)) != null) {
    ret.push(result[1].trim().slice(1, -1));
  }
  return ret;
}

function findAllImports(content) {
  var contentComment = commentUtil.stashJsComments(content);
  content = contentComment.content;
  var ret = [];
  importRegExp.lastIndex = 0;
  var result;
  while ((result = importRegExp.exec(content)) != null) {
    ret.push(result[2]);
  }
  return ret;
}


function replaceAll(content, fn) {
  var contentComment = commentUtil.stashJsComments(content);
  content = contentComment.content;
  content = content.replace(requireRegExp, function (match, rawDep) {
    var expectLines = rawDep.split(/\n/).length - 1;
    var dep = rawDep.trim();
    var quote = dep.charAt(0);
    dep = dep.slice(1, -1);
    var leading = match.match(/^(.?\s*)require\s*\(/)[1];
    var ret = fn(match.slice(leading.length), quote, dep);
    var actualLines = ret.split(/\n/).length - 1;
    actualLines = Math.max(expectLines - actualLines, 0);
    return leading + ret + repeat('\n', actualLines);
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
  findAllImports: findAllImports,
  replaceAll: replaceAll,
  splitPackageName: splitPackageName,
  isRelativeModule: function (dep) {
    return startsWith(dep, './') || startsWith(dep, '../');
  }
};
