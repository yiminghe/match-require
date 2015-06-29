var requireRegExp = /(?:[^.]|^)\s*require\s*\((['"])([^)]+)\1\)/g;
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

module.exports = {
  findAll: findAll,
  replaceAll: replaceAll
};
