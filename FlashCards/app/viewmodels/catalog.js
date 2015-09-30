define(['durandal/system', 'services/flashCardService'], function(system, service) {
  var vm = {};

  vm.catalogNames = [];

  vm.goToCards = function(name) {
    console.log('*** deck selected: ' + name);
  };

  vm.activate = function() {
    system.log('*** activating catalog');
    return service.catalogNames()
      .done(function(data) {
        vm.catalogNames = data;
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
