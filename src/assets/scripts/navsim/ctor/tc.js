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

  wrapper.querySelectorAll(".screw").forEach(screwElement => {
    let randomAngle = Math.floor(Math.random() * 360);

    screwElement.querySelectorAll(".screw__slot").forEach((slotElement, i) => {
      setElementRotation(slotElement, randomAngle + i * 90);
    });
  });
}
