'use strict';

var uuid = require('node-uuid').v4();
var tag = ' __koa_modularize_' + uuid + '__';
var tagReg = new RegExp(tag + '\\d+ ', 'g');
var idReg = new RegExp(tag + '(\\d+) ');

function stashComments(reg, content) {
  // Remove comments from the callback string,
  // look for require calls, and pull them into the dependencies,
  // but only if there are function args.
  var id = 0;
  var comments = [];

  // hide comments
  content = content.replace(reg, function (match) {
    comments.push(match);
    return tag + (id++) + ' ';
  });
  return {
    content: content,
    comments: comments
  };
}

function restoreComments(content, comments) {
  // restore comments
  content = content.replace(tagReg, function (m) {
    var id = parseInt(m.match(idReg)[1]);
    return comments[id];
  });

  return content;
}

var commentJsRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;

module.exports = {
  stashJsComments: stashComments.bind(null, commentJsRegExp),
  restoreComments: restoreComments
};
