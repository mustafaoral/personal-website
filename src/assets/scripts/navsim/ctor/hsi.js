function Hsi(wrapper) {
  const _ringElement = wrapper.querySelector(".instrumentHsi__ring"),
    _innerElement = wrapper.querySelector(".instrumentHsi__inner"),
    _crsElement = wrapper.querySelector(".instrumentHsi__crs"),
    _hdgBugElement = wrapper.querySelector(".instrumentHsi__hdgBug"),
    _needleElement = wrapper.querySelector(".instrumentHsi__crsElement_needle"),
    _crsKnobElement = wrapper.querySelector(".instrumentHsi__crsKnob .instrumentKnob__graphic"),
    _crsHandleElement = wrapper.querySelector(".instrumentHsi__crsKnob .instrumentKnob__handle"),
    _hdgKnobElement = wrapper.querySelector(".instrumentHsi__hdgKnob .instrumentKnob__graphic"),
    _hdgHandleElement = wrapper.querySelector(".instrumentHsi__hdgKnob .instrumentKnob__handle"),
    _toElement = wrapper.querySelector(".instrumentHsi__toFrom_to"),
    _fromElement = wrapper.querySelector(".instrumentHsi__toFrom_from"),
    _navFlagElement = wrapper.querySelector(".instrumentHsi__navFlag"),
    _crs1Element = wrapper.querySelector(".instrumentHsi__digit_crs1"),
    _crs2Element = wrapper.querySelector(".instrumentHsi__digit_crs2"),
    _crs3Element = wrapper.querySelector(".instrumentHsi__digit_crs3"),
    _hdg1Element = wrapper.querySelector(".instrumentHsi__digit_hdg1"),
    _hdg2Element = wrapper.querySelector(".instrumentHsi__digit_hdg2"),
    _hdg3Element = wrapper.querySelector(".instrumentHsi__digit_hdg3"),
    _needleFullDeviation = 35;

  let _crsKnobAngle = Math.floor(Math.random() * 360),
    _hdgKnobAngle = Math.floor(Math.random() * 360),
    _crsValue = 0,
    _hdgValue = 0,
    _needDeviation = 0,
    _needleSpeed = 1,
    _toFrom = 0,
    _navFlagVisible = false,
    _crsHandleEventCallback,
    _aircraftHeading = 0;

  function setElementRotation(element, value) {
    element.setAttribute("style", `transform: rotate(${value.toFixed(3)}deg);`);
  }

  function getMouseWheelChange(event) {
    let change = 1;

    if (event.deltaY > 0) {
      change *= -1;
    }

    if (event.shiftKey) {
      change *= 10;
    }

    return change;
  }

  function updateDigitElementBackgroundPosition(element, value, exponent) {
    const number = (value % Math.pow(10, exponent + 1) - value % Math.pow(10, exponent)) / Math.pow(10, exponent);

    element.setAttribute("style", `background-position: 0 ${number * -22}px`);
  }

  function updateCrsValue(change) {
    _crsValue = normaliseFor360Degress(_crsValue + change);
  }

  function updateCrsKnob(change) {
    _crsKnobAngle = normaliseFor360Degress(_crsKnobAngle + change * 3);

    setElementRotation(_crsKnobElement, _crsKnobAngle);
  }

  function crsHandleEventHandler(event) {
    const change = getMouseWheelChange(event);

    updateCrsValue(change);
    updateCrsKnob(change);

    updateDigitElementBackgroundPosition(_crs1Element, _crsValue, 2);
    updateDigitElementBackgroundPosition(_crs2Element, _crsValue, 1);
    updateDigitElementBackgroundPosition(_crs3Element, _crsValue, 0);

    if (_crsHandleEventCallback) {
      _crsHandleEventCallback(_crsValue);
    }

    event.preventDefault();
  }

  _crsHandleElement.addEventListener("wheel", crsHandleEventHandler, { passive: false });

  function updateHdgValue(change) {
    _hdgValue = normaliseFor360Degress(_hdgValue + change);
  }

  function updateHdgKnob(change) {
    _hdgKnobAngle = normaliseFor360Degress(_hdgKnobAngle + change * 3);

    setElementRotation(_hdgKnobElement, _hdgKnobAngle);
  }

  function hdgHandleEventHandler(event) {
    const change = getMouseWheelChange(event);

    updateHdgValue(change);
    updateHdgKnob(change);

    updateDigitElementBackgroundPosition(_hdg1Element, _hdgValue, 2);
    updateDigitElementBackgroundPosition(_hdg2Element, _hdgValue, 1);
    updateDigitElementBackgroundPosition(_hdg3Element, _hdgValue, 0);

    event.preventDefault();
  }

  _hdgHandleElement.addEventListener("wheel", hdgHandleEventHandler, { passive: false });

  function normaliseFor360Degress(value) {
    return (value + 360) % 360;
  }

  // todo proto inheritance for hsi & cdi
  function getNeedleDeviation(aircraftSensorData) {
    // has added 10 degrees to reduce number of if statements
    let navaidCourseToAircraft = normaliseFor360Degress((aircraftSensorData.courseToNavaid1 + 180) % 360 - _crsValue + 10);

    if (navaidCourseToAircraft >= 20 && navaidCourseToAircraft <= 180) {
      return -1;
    }

    if (navaidCourseToAircraft >= 200 && navaidCourseToAircraft <= 360) {
      return 1;
    }

    if (navaidCourseToAircraft > 180 && navaidCourseToAircraft < 200) {
      return (190 - navaidCourseToAircraft) / -10;
    }

    return (navaidCourseToAircraft - 10) / -10;
  }

  function getToFrom(aircraftSensorData) {
    let navaidCourseToAircraft = normaliseFor360Degress((aircraftSensorData.courseToNavaid1 + 180) % 360 - _crsValue);

    if (navaidCourseToAircraft >= 92 && navaidCourseToAircraft <= 268) {
      return 1;
    }

    if (navaidCourseToAircraft <= 88 || navaidCourseToAircraft >= 272) {
      return 2;
    }

    return 0;
  }

  function updateNeedleElement(elapsed, aircraftSensorData, navFlagVisible) {
    let needleDeviation;

    if (navFlagVisible) {
      needleDeviation = 0;
    }
    else {
      needleDeviation = getNeedleDeviation(aircraftSensorData);
    }

    if (needleDeviation !== _needDeviation) {
      let diff = needleDeviation - _needDeviation;

      if (diff > 0) {
        diff = 1;
      }
      else {
        diff = -1;
      }

      _needDeviation += elapsed * _needleSpeed / 1000 * diff;

      if (diff > 0) {
        _needDeviation = Math.min(_needDeviation, needleDeviation);
      }
      else {
        _needDeviation = Math.max(_needDeviation, needleDeviation);
      }

      _needleElement.setAttribute("style", `transform: translate(${(_needleFullDeviation * _needDeviation).toFixed(3)}px)`);
    }
  }

  function updateToFrom(aircraftSensorData, navFlagVisible) {
    let toFrom;

    if (navFlagVisible) {
      toFrom = 0;
    }
    else {
      toFrom = getToFrom(aircraftSensorData);
    }

    if (_toFrom !== toFrom) {
      _toElement.classList.remove("instrumentHsi__toFrom_visible");
      _fromElement.classList.remove("instrumentHsi__toFrom_visible");

      if (toFrom === 1) {
        _toElement.classList.add("instrumentHsi__toFrom_visible");
      }
      else if (toFrom === 2) {
        _fromElement.classList.add("instrumentHsi__toFrom_visible");
      }

      _toFrom = toFrom;
    }
  }

  function updateNavFlag(navFlagVisible) {
    if (_navFlagVisible !== navFlagVisible) {
      if (!_navFlagVisible) {
        _navFlagElement.classList.add("instrumentHsi__navFlag_visible");
      }
      else {
        _navFlagElement.classList.remove("instrumentHsi__navFlag_visible");
      }

      _navFlagVisible = navFlagVisible;
    }
  }

  this.update = function (elapsed, aircraftSensorData, navaid) {
    const navFlagVisible = aircraftSensorData.distanceToNavaid1 < 0.05 || !navaid.isOmnidirectional();
    
    if (aircraftSensorData.heading !== _aircraftHeading) {
      const change = _aircraftHeading - aircraftSensorData.heading;

      _aircraftHeading = aircraftSensorData.heading;

      updateHdgKnob(change * 3);
    }

    updateNeedleElement(elapsed, aircraftSensorData, navFlagVisible);
    updateToFrom(aircraftSensorData, navFlagVisible);
    updateNavFlag(navFlagVisible);

    setElementRotation(_ringElement, aircraftSensorData.heading * -1);
    setElementRotation(_innerElement, _crsValue - aircraftSensorData.heading);
    setElementRotation(_crsElement, _crsValue - aircraftSensorData.heading);
    setElementRotation(_hdgBugElement, _hdgValue - aircraftSensorData.heading);
  };

  setElementRotation(_crsKnobElement, _crsKnobAngle);
  setElementRotation(_hdgKnobElement, _hdgKnobAngle);

  this.registerObsHandleEventCallback = function (callback) {
    _crsHandleEventCallback = callback;
  };
}
