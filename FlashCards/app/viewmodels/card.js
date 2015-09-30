define([], function() {

  var vm = {};
  vm.indexParam = 0;

  // This viewModel is the target of a child route, so it gets ALL the parameters from parent and child route
  vm.activate = function(name, index) {
    vm.indexParam = index;
  };

  return vm;

});
