define(['durandal/system',
  'mockData/multiplication',
  'mockData/statesAndCapitals',
], function(system,multiplication, states) {

  var data = {
    'Multiplication': multiplication.cards,
    'States and Capitals': states.cards
  };

  var names = Object.keys(data);

  var service = {};

  service.catalogNames = function() {
    system.log('=== Getting catalog names...');
    return system.defer(function(dfd) {
      dfd.resolve(names);
    });
  };

  service.getCards = function(name) {
    system.log('=== Getting cards ...');
    return system.defer(function(dfd) {
      if (data[name]) {
        dfd.resolve(data[name]);
      } else {
        dfd.reject();
      }
    });
  };

  return service;

});
