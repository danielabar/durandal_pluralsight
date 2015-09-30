define(['models/selectedCards'], function(selectedCards) {

  var vm = {};
  vm.indexParam = 0;
  vm.selected = selectedCards;

  // This viewModel is the target of a child route, so it gets ALL the parameters from parent and child route
  vm.activate = function(name, index) {
    vm.indexParam = index;
  };

  // Set index here in attached function to fix flashing/timing issue
  vm.attached = function() {
    selectedCards.setIndex(vm.indexParam);
  };

  vm.flip = function() {
    $('.card').toggleClass('flip');
  };

  return vm;

});
