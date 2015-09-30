define(['models/selectedCards'], function(selectedCards) {
  var vm = {};

  // In this way, the viewModel can bind to properties in the selectedCards module
  vm.selected = selectedCards;

  vm.activate = function(name) {
    selectedCards.select(name);
  };

  return vm;
});
