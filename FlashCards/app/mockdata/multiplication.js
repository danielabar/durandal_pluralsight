define(['models/Card'], function(Card) {

  var cards = [
    new Card('Question:', '1 x 1', 'Answer:', '1'),
    new Card('Question:', '1 x 2', 'Answer:', '2')
  ];

  return {
    cards: cards
  };

});
