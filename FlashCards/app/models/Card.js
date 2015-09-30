define(function() {
  var Card = function(frontHeading, front, backHeading, back) {
    this.frontHeading = frontHeading;
    this.front = front;
    this.backHeading = backHeading;
    this.back = back;
  };

  return Card;
});
