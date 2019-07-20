function Navaid() {
  let _types = ["vor", "vordme", "ndb"],
    _typeIndex = 0,
    _type = _types[_typeIndex],
    _x = Math.floor(Math.random() * 700 + 50),
    _y = Math.floor(Math.random() * 450 + 50);

  this.cycleType = function () {
    _typeIndex = (_typeIndex + 1) % 3;

    _type = _types[_typeIndex];
  };

  this.getType = function () {
    return _type;
  };

  this.setPosition = function (x, y) {
    _x = x;
    _y = y;
  };

  this.getPosition = function () {
    return {
      x: _x,
      y: _y
    };
  };
}

Navaid.prototype.isOmnidirectional = function () {
  return this.getType() === "vor" || this.getType() === "vordme";
};
