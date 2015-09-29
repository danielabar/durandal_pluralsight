define(function() {
  var Card = function(qLabel, question, aLabel, answer) {
    this.qLabel = qLabel;
    this.question = question;
    this.aLabel = aLabel;
    this.answer = answer;
  };

  return Card;
});
