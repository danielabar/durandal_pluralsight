define(
  ['durandal/system',
  'services/flashCardService',
  'plugins/router'],
  function(system, service, router) {
    var vm = {};

    vm.catalogNames = [];

    vm.goToCards = function(name) {
      console.log('*** deck selected: ' + name);
      router.navigate('#cards/' + encodeURIComponent(name) + '/id/0');
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
