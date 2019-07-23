function Tc(wrapper) {
  const _aircraftElement = wrapper.querySelector(".instrumentTc__aircraft");
  let _previousTurnRate;

  function setElementRotation(element, value) {
    element.setAttribute("style", `transform: rotate(${value.toFixed(3)}deg)`);
  }

  this.update = function (aircraftSensorData) {
    if (aircraftSensorData.turnRate === _previousTurnRate) {
      return;
    }

    _previousTurnRate = aircraftSensorData.turnRate;

    setElementRotation(_aircraftElement, aircraftSensorData.turnRate * 10);
  };
}
