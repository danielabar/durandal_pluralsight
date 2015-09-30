define(['durandal/system'], function(system) {
  var vm = {};

  var builtWithData = ['Knockout', 'jQuery', 'RequireJS'];

  vm.activate = function() {
    system.log('*** activate about');
  };

  vm.attached = function() {
    system.log('*** attached about');
  };

  vm.canActivate = function() {
    // return {redirect: '#catalog'};
    return true;
  };

  vm.builtWith = builtWithData;

  vm.clearList = function() {
    vm.builtWith = [];
  };

  vm.resetList = function() {
    vm.builtWith = builtWithData;
  };

  return vm;
});
