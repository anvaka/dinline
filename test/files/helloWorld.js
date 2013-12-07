module.exports = helloWorldDirective;

function helloWorldDirective() {
  return {
    templateUrl:'./helloWorld.html'
  };
}

// browserify should inline template, print it to simplify tests:
console.log(helloWorldDirective().template);
