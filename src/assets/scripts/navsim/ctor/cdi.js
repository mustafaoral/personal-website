function Cdi(wrapper) {
  const _ringElement = wrapper.querySelector(".instrumentCdi__ring"),
    _knobElement = wrapper.querySelector(".instrumentKnob__graphic"),
    _needleElement = wrapper.querySelector(".instrumentCdi__needleElement"),
    _obsHandleElement = wrapper.querySelector(".instrumentKnob__handle"),
    _toFromIndicatorElement = wrapper.querySelector(".instrumentCdi__toFromRoller"),
    _navFlagElement = wrapper.querySelector(".instrumentCdi__navRoller"),
    _needleFullDeviation = 42;

  let _knobAngle = Math.floor(Math.random() * 360),
    _needDeviation = 0,
    _needleSpeed = 1,
    _toFrom = 0,
    _navFlagVisible = false,
    _obsHandleEventCallback,
    _obsValue = 0;

  function setElementRotation(element, value) {
    element.setAttribute("style", `transform: rotate(${value.toFixed(3)}deg)`);
  }

  function normaliseFor360Degress(value) {
    return (value + 360) % 360;
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

  function updateKnobAndRing(change) {
    _knobAngle = normaliseFor360Degress(_knobAngle + change * 3);

    setElementRotation(_knobElement, _knobAngle);
    setElementRotation(_ringElement, _obsValue * -1);
  }

  function updateObsValue(change) {
    _obsValue = normaliseFor360Degress(_obsValue + change);
  }

  function obsHandleEventHandler(event) {
    const change = getMouseWheelChange(event);

    updateObsValue(change);
    updateKnobAndRing(change);

    if (_obsHandleEventCallback) {
      _obsHandleEventCallback(_obsValue);
    }

    event.preventDefault();
  }

  _obsHandleElement.addEventListener("wheel", obsHandleEventHandler, { passive: false });

  // todo proto inheritance for hsi & cdi
  function getNeedleDeviation(aircraftSensorData) {
    // has added 10 degrees to reduce number of if statements
    let navaidCourseToAircraft = normaliseFor360Degress((aircraftSensorData.courseToNavaid2 + 180) % 360 - _obsValue + 10);

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
    let navaidCourseToAircraft = normaliseFor360Degress((aircraftSensorData.courseToNavaid2 + 180) % 360 - _obsValue);

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
      _toFromIndicatorElement.classList.remove("instrumentCdi__toFromRoller_to", "instrumentCdi__toFromRoller_from");

      if (toFrom === 1) {
        _toFromIndicatorElement.classList.add("instrumentCdi__toFromRoller_to");
      }
      else if (toFrom === 2) {
        _toFromIndicatorElement.classList.add("instrumentCdi__toFromRoller_from");
      }

      _toFrom = toFrom;
    }
  }

  function updateNavFlag(navFlagVisible) {
    if (_navFlagVisible !== navFlagVisible) {
      if (!_navFlagVisible) {
        _navFlagElement.classList.add("instrumentCdi__navRoller_visible");
      }
      else {
        _navFlagElement.classList.remove("instrumentCdi__navRoller_visible");
      }

      _navFlagVisible = navFlagVisible;
    }
  }

  this.update = function (elapsed, aircraftSensorData, navaid) {
    const navFlagVisible = aircraftSensorData.distanceToNavaid2 < 0.05 || !navaid.isOmnidirectional();

    updateNeedleElement(elapsed, aircraftSensorData, navFlagVisible);
    updateToFrom(aircraftSensorData, navFlagVisible);
    updateNavFlag(navFlagVisible);
  };

  this.registerObsHandleEventCallback = function (callback) {
    _obsHandleEventCallback = callback;
  };

  setElementRotation(_knobElement, _knobAngle);
}
