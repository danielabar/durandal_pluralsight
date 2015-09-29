define(['durandal/system'], function(system) {
  var vm = {};

  vm.activate = function() {
    // use system.defer and setTimeout to simulate waiting for an ajax request
    return system.defer(function(def) {
      setTimeout(function() {
        system.log('*** activate catalog inside timeout');
        def.resolve();
      }, 2000);
    });
  };

  vm.attached = function() {
    system.log('*** attached catalog');
  };

  vm.canDeactivate = function() {
    return true;
  };

  return vm;
});
