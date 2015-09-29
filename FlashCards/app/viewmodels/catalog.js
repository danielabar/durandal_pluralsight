define(['durandal/system', 'services/flashCardService'], function(system, service) {
  var vm = {};

  var catalogNames = [];

  vm.activate = function() {
    system.log('*** activating catalog');
    return service.catalogNames()
      .done(function(data) {
        // NOTE: For data binding, the value must always be set through the view model
        // so that the view gets updated when the value changes.
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
