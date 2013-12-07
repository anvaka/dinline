// TODO: I need better error handling and logging

module.exports = browserifyFile;

var through = require('through');
var falafel = require('falafel');
var path = require('path');
var fs = require('fs');

function browserifyFile(file) {
  var pending = 0;
  var data = '';
  var dirname  = path.dirname(file);
  var tr = through(write, end);

  return tr;

  function write (buf) { data += buf }
  function end () {
    try { var output = parse() }
    catch (err) {
      this.emit('error', new Error(
        err.toString().replace('Error: ', '') + ' (' + file + ')')
      );
    }

    if (pending === 0) {
      finish(output);
    }
  }

  function finish (output) {
    tr.queue(String(output));
    tr.queue(null);
  }

  function parse() {
    var output = falafel(data, function (node) {
      var isTemplateUrlDefinition = node.type === 'Identifier' &&
        node.name === 'templateUrl' &&
        node.parent.type === 'Property' &&
        node.parent.kind === 'init' && 
        node.parent.value.type === 'Literal';
      if (!isTemplateUrlDefinition) return;

      // we only accept directives declared via return {} statement by now:
      var isObjectReturn = node.parent.parent.type === 'ObjectExpression' &&
                           node.parent.parent.parent.type === 'ReturnStatement';
      if (!isObjectReturn) return;

      var templateName = node.parent.value.value;
      var fullTemplatePath = path.resolve(dirname, templateName);

      ++ pending;
      // todo: what if file is not encoded in unicode?
      fs.readFile(fullTemplatePath, 'utf8', function (err, src) {
        if (err) return tr.emit('error', err);
        // TODO: consider using html-minifier
        // https://npmjs.org/package/html-minifier
        node.parent.update('template: ' + JSON.stringify(src));
        if (--pending === 0) finish(output);
      });
    });

    return output;
  }
}
