define(['models/selectedCards', 'plugins/router', 'durandal/system'], function(selectedCards, router, system) {
  var vm = {};

  // In this way, the viewModel can bind to properties in the selectedCards module
  vm.selected = selectedCards;
  var nameParam;

  // Create a child router
  vm.router = router.createChildRouter()
    .makeRelative({
      route: 'cards/:param1'
    }).map([
      {route: ['id(/:param2)', ''], moduleId: 'viewmodels/card'}
    ]).buildNavigationModel();

  vm.activate = function(name) {
    selectedCards.select(name);
    nameParam = name;
  };

  vm.binding = function() {
    return selectedCards.select(nameParam);
  };

  vm.previous = function() {
    if (selectedCards.hasPrevious) {
      navigate(selectedCards.previousIndex());
    }
  };

  vm.next = function() {
    if (selectedCards.hasNext) {
      navigate(selectedCards.nextIndex());
    }
  };

  function navigate(index) {
    var url = '#cards/' + encodeURIComponent(selectedCards.name) + '/id/' + index;
    system.log(url);
    router.navigate(url);
  }

  return vm;
});
