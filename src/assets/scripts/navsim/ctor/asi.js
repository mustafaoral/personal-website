function Asi(wrapper) {
  const _needleElement = wrapper.querySelector(".instrumentAsi__needle");
  let _previousSpeed;

  function setElementRotation(element, value) {
    element.setAttribute("style", `transform: rotate(${value.toFixed(3)}deg)`);
  }

  this.update = function (aircraftSensorData) {
    if (aircraftSensorData.airspeed === _previousSpeed) {
      return;
    }

    _previousSpeed = aircraftSensorData.airspeed;

    let needleAngle;

    if (aircraftSensorData.airspeed < 40) {
      needleAngle = aircraftSensorData.airspeed;
    } else {
      needleAngle = 40 + (aircraftSensorData.airspeed - 40) * 2;
    }

    setElementRotation(_needleElement, needleAngle);
  };
}
