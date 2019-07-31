function Rmi(wrapper) {
  const _innerElement = wrapper.querySelector(".instrumentRmi__inner"),
    _needleLeftElement = wrapper.querySelector(".instrumentRmi__needleGroup_navaid1"),
    _needleRightElement = wrapper.querySelector(".instrumentRmi__needleGroup_navaid2"),

    _selectorLeftElement = wrapper.querySelector(".instrumentRmi__selector_left"),
    _selectorLeftHandleElement = wrapper.querySelector(".instrumentRmiSelector__handle_left"),
    _navFlagLeftElement = wrapper.querySelector(".instrumentRmi__navFlag_left"),
    _dmeLeft1Element = wrapper.querySelector(".instrumentRmi__dme_left1 .instrumentRmi__dmeDigit"),
    _dmeLeft2Element = wrapper.querySelector(".instrumentRmi__dme_left2 .instrumentRmi__dmeDigit"),
    _dmeLeft3Element = wrapper.querySelector(".instrumentRmi__dme_left3 .instrumentRmi__dmeDigit"),
    _dmeLeft4Element = wrapper.querySelector(".instrumentRmi__dme_left4 .instrumentRmi__dmeDigit"),
    _barberPoleLeftElement = wrapper.querySelector(".instrumentRmi__barberPole_left"),

    _selectorRightElement = wrapper.querySelector(".instrumentRmi__selector_right"),
    _selectorRightHandleElement = wrapper.querySelector(".instrumentRmiSelector__handle_right"),
    _navFlagRightElement = wrapper.querySelector(".instrumentRmi__navFlag_right"),
    _dmeRight1Element = wrapper.querySelector(".instrumentRmi__dme_right1 .instrumentRmi__dmeDigit"),
    _dmeRight2Element = wrapper.querySelector(".instrumentRmi__dme_right2 .instrumentRmi__dmeDigit"),
    _dmeRight3Element = wrapper.querySelector(".instrumentRmi__dme_right3 .instrumentRmi__dmeDigit"),
    _dmeRight4Element = wrapper.querySelector(".instrumentRmi__dme_right4 .instrumentRmi__dmeDigit"),
    _barberPoleRightElement = wrapper.querySelector(".instrumentRmi__barberPole_right"),

    _needleSpeed = 50;

  let _selectorValueL = 0,
    _needleLAngle = 0,
    _navFlagLVisible = false,
    _barberPoleLVisible = false,

    _selectorValueR = 0,
    _needleRAngle = 0,
    _navFlagRVisible = false,
    _barberPoleRVisible = false;

  function truncate(x) {
    return x.toFixed(3);
  }

  function setElementRotation(element, value) {
    element.setAttribute("style", `transform: rotate(${truncate(value)}deg);`);
  }

  function getNeedleAngle(elapsed, needleAngle, navaid, aircraftSensorData, courseSelector, distanceSelector, selectorMismatch) {
    let target = 0;

    if (selectorMismatch || navaid.isOmnidirectional() && aircraftSensorData[distanceSelector] < 0.05) {
      target = 90;
    }
    else {
      target = normaliseFor360Degress(aircraftSensorData[courseSelector] - aircraftSensorData.heading);
    }

    if (needleAngle === target) {
      return needleAngle;
    }

    let diff = target - needleAngle;
    const needleMovement = elapsed / 1000 * _needleSpeed;

    let clockwiseRotation = normaliseFor360Degress(target - needleAngle);

    if (clockwiseRotation > 180) {
      diff = 360 - clockwiseRotation;
    }

    if (Math.abs(diff) < needleMovement) {
      needleAngle = target;
    }
    else {
      if (clockwiseRotation > 180) {
        needleAngle -= needleMovement;
      }
      else {
        needleAngle += needleMovement;
      }
    }

    return normaliseFor360Degress(needleAngle);
  }

  function normaliseFor360Degress(value) {
    return (value + 360) % 360;
  }

  function mask10(number, powerOf10) {
    return ((number % Math.pow(10, powerOf10 + 1)) - (number % Math.pow(10, powerOf10))) / Math.pow(10, powerOf10);
  }

  setElementRotation(_selectorLeftElement, _selectorValueL * -90);
  setElementRotation(_selectorRightElement, _selectorValueR * 90);

  _selectorLeftHandleElement.addEventListener("mousedown", _ => {
    _selectorValueL += 1;
    _selectorValueL %= 2;

    setElementRotation(_selectorLeftElement, _selectorValueL * -90);
  });

  _selectorRightHandleElement.addEventListener("mousedown", _ => {
    _selectorValueR += 1;
    _selectorValueR %= 2;

    setElementRotation(_selectorRightElement, _selectorValueR * 90);
  });

  function getDmeValues(distanceToNavaid) {
    let dme1Value = mask10(distanceToNavaid, 2),
      dme2Value = mask10(distanceToNavaid, 1),
      dme3Value = mask10(distanceToNavaid, 0),
      dme4Value = distanceToNavaid % 1 / 0.1;

    if (dme4Value > 9) {
      dme3Value += dme4Value % 1;
    }

    if (dme3Value > 9) {
      dme2Value += dme4Value % 1;
    }

    if (dme2Value > 9) {
      dme1Value += dme4Value % 1;
    }

    return {
      _1: dme1Value,
      _2: dme2Value,
      _3: dme3Value,
      _4: dme4Value
    };
  }

  function updateDmeElementTransform(element, value) {
    element.setAttribute("style", `transform: translate(0px, ${truncate(-14 * value)}px)`);
  }

  this.update = function (elapsed, aircraftSensorData, navaid1, navaid2) {
    const selectorLMismatch = _selectorValueL === 0 && !navaid1.isOmnidirectional() || _selectorValueL === 1 && navaid1.isOmnidirectional(),
      selectorRMismatch = _selectorValueR === 0 && !navaid2.isOmnidirectional() || _selectorValueR === 1 && navaid2.isOmnidirectional(),
      showBarberPoleL = selectorLMismatch || navaid1.getType() !== "vordme",
      showBarberPoleR = selectorRMismatch || navaid2.getType() !== "vordme";

    if (selectorLMismatch || aircraftSensorData.distanceToNavaid1 < 0.05) {
      if (!_navFlagLVisible) {
        _navFlagLVisible = true;

        _navFlagLeftElement.classList.add("instrumentRmi__navFlag_visible");
      }
    }
    else if (_navFlagLVisible) {
      _navFlagLVisible = false;

      _navFlagLeftElement.classList.remove("instrumentRmi__navFlag_visible");
    }

    if (selectorRMismatch || aircraftSensorData.distanceToNavaid2 < 0.05) {
      if (!_navFlagRVisible) {
        _navFlagRVisible = true;

        _navFlagRightElement.classList.add("instrumentRmi__navFlag_visible");
      }
    }
    else if (_navFlagRVisible) {
      _navFlagRVisible = false;

      _navFlagRightElement.classList.remove("instrumentRmi__navFlag_visible");
    }

    setElementRotation(_innerElement, aircraftSensorData.heading * -1);

    if (showBarberPoleL) {
      if (!_barberPoleLVisible) {
        _barberPoleLVisible = true;

        _barberPoleLeftElement.classList.add("instrumentRmi__barberPole_visible");
      }
    }
    else if (_barberPoleLVisible) {
      _barberPoleLVisible = false;

      _barberPoleLeftElement.classList.remove("instrumentRmi__barberPole_visible");
    }

    if (showBarberPoleR) {
      if (!_barberPoleRVisible) {
        _barberPoleRVisible = true;

        _barberPoleRightElement.classList.add("instrumentRmi__barberPole_visible");
      }
    }
    else if (_barberPoleRVisible) {
      _barberPoleRVisible = false;

      _barberPoleRightElement.classList.remove("instrumentRmi__barberPole_visible");
    }

    if (!showBarberPoleL) {
      const dmeValues = getDmeValues(aircraftSensorData.distanceToNavaid1);

      updateDmeElementTransform(_dmeLeft1Element, dmeValues._1);
      updateDmeElementTransform(_dmeLeft2Element, dmeValues._2);
      updateDmeElementTransform(_dmeLeft3Element, dmeValues._3);
      updateDmeElementTransform(_dmeLeft4Element, dmeValues._4);
    }

    if (!showBarberPoleR) {
      const dmeValues = getDmeValues(aircraftSensorData.distanceToNavaid2);

      updateDmeElementTransform(_dmeRight1Element, dmeValues._1);
      updateDmeElementTransform(_dmeRight2Element, dmeValues._2);
      updateDmeElementTransform(_dmeRight3Element, dmeValues._3);
      updateDmeElementTransform(_dmeRight4Element, dmeValues._4);
    }

    _needleLAngle = getNeedleAngle(elapsed, _needleLAngle, navaid1, aircraftSensorData, "courseToNavaid1", "distanceToNavaid1", selectorLMismatch);
    _needleRAngle = getNeedleAngle(elapsed, _needleRAngle, navaid2, aircraftSensorData, "courseToNavaid2", "distanceToNavaid2", selectorRMismatch);

    setElementRotation(_needleLeftElement, _needleLAngle);
    setElementRotation(_needleRightElement, _needleRAngle);
  };
}
