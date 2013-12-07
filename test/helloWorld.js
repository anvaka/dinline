var test = require('tap').test;
var browserify = require('browserify');
var fs = require('fs');
var vm = require('vm');

var html = fs.readFileSync(__dirname + '/files/helloWorld.html', 'utf8');

test('bundle a directive', function (t) {
  t.plan(1);

  var b = browserify();
  b.add(__dirname + '/files/helloWorld.js');
  b.transform(require('../'));

  b.bundle(function (err, src) {
    if (err) t.fail(err);
    vm.runInNewContext(src, { console: { log: log } });
  });

  function log(msg) {
    t.equal(msg, html, "inlined html should match");
  }
});
