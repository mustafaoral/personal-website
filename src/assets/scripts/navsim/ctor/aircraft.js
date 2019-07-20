function Aircraft() {
  let _speed = 0,
    _heading = 0,
    _turnRate = 0,
    _distanceToNavaid1 = 0,
    _distanceToNavaid2 = 0,
    _courseToNavaid1 = 0,
    _courseToNavaid2 = 0,
    _x = Math.random() * 700 + 50,
    _y = Math.random() * 450 + 50,
    _accelerate = false,
    _decelerate = false,
    _turnLeft = false,
    _turnRight = false,
    _turnToStandard = false,
    _stopTurn = false;

  const _rollRate = 3;

  function getAcceleration(speed) {
    return (1 / (speed / 155 * 6 + 4) - 0.1) / 5;
  }

  function getDeceleration(speed) {
    return (1 / (8 + (155 - speed) / 155 * 10) - 0.05) / 5;
  }

  function getDistanceToNavaid(navaidPosition) {
    return Math.sqrt(Math.pow(_y - navaidPosition.y, 2) + Math.pow(_x - navaidPosition.x, 2)) / 200;
  }

  function getCourseToNavaid(navaidPosition) {
    return (Math.atan2(navaidPosition.y - _y, navaidPosition.x - _x) * 180 / Math.PI + 450) % 360;
  }

  function updateCourseAndDistanceToNavaids(navaid1Position, navaid2Position) {
    _distanceToNavaid1 = getDistanceToNavaid(navaid1Position);
    _distanceToNavaid2 = getDistanceToNavaid(navaid2Position);

    _courseToNavaid1 = getCourseToNavaid(navaid1Position);
    _courseToNavaid2 = getCourseToNavaid(navaid2Position);
  }

  this.getSensorData = function () {
    return {
      x: _x,
      y: _y,
      airspeed: _speed,
      heading: _heading,
      turnRate: _turnRate,
      courseToNavaid1: _courseToNavaid1,
      distanceToNavaid1: _distanceToNavaid1,
      courseToNavaid2: _courseToNavaid2,
      distanceToNavaid2: _distanceToNavaid2
    };
  };

  this.getPosition = function () {
    return {
      x: _x,
      y: _y
    };
  };

  this.setPosition = function (x, y) {
    _x = x;
    _y = y;
  };

  this.increaseSpeed = function () {
    _accelerate = true;
  };

  this.decreaseSpeed = function () {
    _decelerate = true;
  };

  this.turnLeft = function (toStandard) {
    _turnToStandard = toStandard;

    _turnLeft = true;

    _stopTurn = false;
  };

  this.turnRight = function (toStandard) {
    _turnToStandard = toStandard;

    _turnRight = true;

    _stopTurn = false;
  };

  this.stopTurn = function () {
    _stopTurn = true;
  };

  function getNewTurnRate(elapsedSeconds) {
    if (_turnLeft) {
      if (_turnToStandard === true) {
        if (Math.abs(_turnRate) !== 3) {
          if (_turnRate > 3) {
            _turnRate -= _rollRate * elapsedSeconds;

            if (_turnRate < 3) {
              _turnRate = 3;
            }
          }
          else if (_turnRate > -3) {
            _turnRate -= _rollRate * elapsedSeconds;

            if (_turnRate < -3) {
              _turnRate = -3;
            }
          }
        }
      }
      else if (_turnRate > -7) {
        _turnRate -= _rollRate * elapsedSeconds;
      }
    }

    if (_turnRight) {
      if (_turnToStandard === true) {
        if (Math.abs(_turnRate) !== 3) {
          if (_turnRate < -3) {
            _turnRate += _rollRate * elapsedSeconds;

            if (_turnRate > -3) {
              _turnRate = -3;
            }
          }
          else if (_turnRate < 3) {
            _turnRate += _rollRate * elapsedSeconds;

            if (_turnRate > 3) {
              _turnRate = 3;
            }
          }
        }
      }
      else if (_turnRate < 7) {
        _turnRate += _rollRate * elapsedSeconds;
      }
    }

  }

  this.update = function (elapsed, navaid1, navaid2, windHdg, windSpeed) {
    let headingInRadian,
      distanceCoveredInNm,
      windDistance;

    const elapsedSeconds = elapsed / 1000;

    getNewTurnRate(elapsedSeconds);

    _turnLeft = false;
    _turnRight = false;
    _turnToStandard = false;

    _heading += _turnRate * elapsedSeconds;

    // normalise
    _heading += 360;
    _heading %= 360;

    if (_accelerate) {
      _speed += getAcceleration(_speed) * elapsed;
    }

    if (_decelerate) {
      _speed -= getDeceleration(_speed) * elapsed;

      if (_speed < 0) {
        _speed = 0;
      }
    }

    _accelerate = false;
    _decelerate = false;

    if (_stopTurn) {
      if (_turnRate === 0) {
        _stopTurn = false;
      }
      else {
        if (_turnRate > 0) {
          _turnRate -= _rollRate * elapsedSeconds;

          if (_turnRate < 0) {
            _turnRate = 0;

            _stopTurn = false;
          }
        }
        else {
          _turnRate += _rollRate * elapsedSeconds;

          if (_turnRate > 0) {
            _turnRate = 0;

            _stopTurn = false;
          }
        }
      }
    }

    distanceCoveredInNm = _speed / 3600000 * elapsed;

    headingInRadian = _heading / 180 * Math.PI;

    _x += Math.sin(headingInRadian) * distanceCoveredInNm * 200;
    _y -= Math.cos(headingInRadian) * distanceCoveredInNm * 200;

    if (windSpeed > 0) {
      windDistance = windSpeed / 2000 * elapsed / 10;

      headingInRadian = windHdg / 180 * Math.PI;

      _x -= Math.sin(headingInRadian) * windDistance;
      _y += Math.cos(headingInRadian) * windDistance;
    }

    if (_x < 0) {
      _x = 0;
    }

    if (_y < 0) {
      _y = 0;
    }

    if (_x > 1200) {
      _x = 1200;
    }

    if (_y > 650) {
      _y = 650;
    }

    updateCourseAndDistanceToNavaids(navaid1.getPosition(), navaid2.getPosition());
  };

  this.init = function (navaid1, navaid2) {
    updateCourseAndDistanceToNavaids(navaid1.getPosition(), navaid2.getPosition());
  };
}
