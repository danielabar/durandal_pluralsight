define(['models/selectedCards', 'plugins/router'], function(selectedCards, router) {
  var vm = {};

  // In this way, the viewModel can bind to properties in the selectedCards module
  vm.selected = selectedCards;

  // Create a child router
  vm.router = router.createChildRouter()
    .makeRelative({
      route: 'cards/:param1'
    }).map([
      {route: ['id(/:param2)', ''], moduleId: 'viewmodels/card'}
    ]).buildNavigationModel();

  vm.activate = function(name) {
    selectedCards.select(name);
  };

  return vm;
});
