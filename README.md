Directive Inline
================

This module is a plugin for [browserify](http://browserify.org/). It looks for angularjs directives in AST, and inlines static template files into directive declaration.

[![build status](https://secure.travis-ci.org/anvaka/dinline.png)](http://travis-ci.org/anvaka/dinline)

# Example - helloWorld directive

Our custom directive template `helloWorld.html`:
``` html
<h1>Hello world</h1>
```

Directive export in `helloWorld.js`:
``` js
module.exports = function () {
  return {
    templateUrl: './helloWorld.html'
  };
};
```

After running on the command line:
```
browserify -t dinline helloWorld.js > bundle.js
```

Our directive definition changes from
``` js
  // ...
  return {
    templateUrl: './helloWorld.html'
  };
```
to
``` js
  // ...
  return {
    template: "<h1>Hello world</h1>\n"
  };
```

**Note:** This transform module implements very simple use case, when directive is declared in a form of `return` statement with explicit literal path assignment to `templateUrl` property. Please let me know if your use case is more sophisticated than this.

# License

BSD 2-clause
