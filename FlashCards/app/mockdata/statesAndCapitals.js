define(['models/Card'], function(Card) {

  var cards = [
    new Card('State:', 'Alabama', 'Capital:', 'Montgomery'),
    new Card('State:', 'Alaska', 'Capital:', 'Juneau')
  ];

  return {
    cards: cards
  };

});
