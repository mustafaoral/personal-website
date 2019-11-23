function DebugInformation() {
  const documentQuerySelector = document.querySelector.bind(document),
    debugInformation = documentQuerySelector(".debugInformation"),
    elementPrefix = ".debugInformation__",
    aircraftPositionX = documentQuerySelector(`${elementPrefix}aircraftPositionX`),
    aircraftPositionY = documentQuerySelector(`${elementPrefix}aircraftPositionY`),
    aircraftAirspeed = documentQuerySelector(`${elementPrefix}aircraftAirspeed`),
    aircraftHeading = documentQuerySelector(`${elementPrefix}aircraftHeading`),
    aircraftTurnRate = documentQuerySelector(`${elementPrefix}aircraftTurnRate`),
    navaid1Crs = documentQuerySelector(`${elementPrefix}navaid1Crs`),
    navaid2Crs = documentQuerySelector(`${elementPrefix}navaid2Crs`),
    navaid1X = documentQuerySelector(`${elementPrefix}navaid1X`),
    navaid1Y = documentQuerySelector(`${elementPrefix}navaid1Y`),
    navaid2X = documentQuerySelector(`${elementPrefix}navaid2X`),
    navaid2Y = documentQuerySelector(`${elementPrefix}navaid2Y`);
  let debug = false;

  function setElementText(element, value, truncateDigits) {
    element.innerHTML = `${value.toFixed(truncateDigits)}`;
  }

  this.update = function (aircraftSensorData, navaid1Position, navaid2Position) {
    if (!debug) {
      return;
    }

    setElementText(aircraftPositionX, aircraftSensorData.x, 1);
    setElementText(aircraftPositionY, aircraftSensorData.y, 1);
    setElementText(aircraftAirspeed, aircraftSensorData.airspeed, 1);
    setElementText(aircraftHeading, aircraftSensorData.heading, 1);
    setElementText(aircraftTurnRate, aircraftSensorData.turnRate, 1);
    setElementText(navaid1Crs, aircraftSensorData.courseToNavaid1, 1);
    setElementText(navaid2Crs, aircraftSensorData.courseToNavaid2, 1);
    setElementText(navaid1X, navaid1Position.x, 0);
    setElementText(navaid1Y, navaid1Position.y, 0);
    setElementText(navaid2X, navaid2Position.x, 0);
    setElementText(navaid2Y, navaid2Position.y, 0);
  };

  function documentKeydownHandler(event) {
    var key = event.key.toUpperCase();

    if (key === "D") {
      debug = !debug;

      debugInformation.setAttribute("style", `display: ${debug ? "block" : "none"}`);

      return;
    }
  }

  document.addEventListener("keydown", documentKeydownHandler);
}
