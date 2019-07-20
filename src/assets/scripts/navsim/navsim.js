(function () {
  const CONST_TO_DEGREE = 180 / Math.PI;

  let navaid1 = new Navaid(),
    navaid2 = new Navaid(),
    aircraft = new Aircraft(),
    asi,
    turnCoordinator,
    hsi,
    cdi,
    rmi,
    debugInformation,
    movingMap,
    aircraftTrace,
    aircraftTraceLines,
    movingMapNavaid1,
    movingMapNavaid2,
    movingMapAircraft,
    informationSimRate,
    informationSimRateValue,
    informationPause,
    informationDisplayWind,
    informationDisplayWindInstructions,
    informationDisplayWindArrowGraphic,
    informationDisplayWindValue,
    userWind,
    userWindLine,
    userWindArrowTip,
    mouseEventsSurfaceHandles,
    aircraftHandle,
    navaid1Handle,
    navaid2Handle,
    navaidHandles,
    navaidDeviationAndObsElements,
    animFrame = window.requestAnimationFrame,
    timestampStart = 0,
    traceTimer = 0,
    tracePoints = [],
    hideWhat = 0,
    paused = false,
    drawNavaidHelpers = false,
    showTrace = false,
    windMode = false,
    keys = [],
    simRate = 1,
    windHdg = 0,
    windSpeed = 0,
    windStart,
    windEnd,
    draggableObjectHandle,
    hsiCourse = 0,
    cdiCourse = 0,
    aircraftCourseToNavaid1,
    aircraftCourseToNavaid2,
    aircraftCourseToNavaidElements;

  function truncate(x, digits) {
    if (digits === undefined) {
      digits = 3;
    }

    return x.toFixed(digits);
  }

  function getCssTransformFragmentForTranslate(x, y) {
    return `translate(${truncate(x)}px, ${truncate(y)}px)`;
  }

  function getCssTransformFragmentForRotate(value) {
    return `rotate(${truncate(value)}deg)`;
  }

  function setElementStyle(element, value) {
    element.setAttribute("style", value);
  }

  function setElementVisibility(element, shoudBeShown) {
    setElementStyle(element, `display: ${shoudBeShown ? "block" : "none"}`);
  }

  function setElementVisibilityViaClass(element, hiddenClassName, shouldBeShown) {
    if (shouldBeShown) {
      element.classList.remove(hiddenClassName);
    }
    else {
      element.classList.add(hiddenClassName);
    }
  }

  function setElementsVisibilityViaClass(elements, hiddenClassName, shouldBeShown) {
    if (shouldBeShown) {
      elements.forEach(x => x.classList.remove(hiddenClassName));
    }
    else {
      elements.forEach(x => x.classList.add(hiddenClassName));
    }
  }

  function updateMovingMapAircraft(aircraftSensorData) {
    setElementStyle(movingMapAircraft, `transform: ${getCssTransformFragmentForTranslate(aircraftSensorData.x, aircraftSensorData.y)} ${getCssTransformFragmentForRotate(aircraftSensorData.heading)}`);

    setElementStyle(aircraftHandle, `top:${truncate(aircraftSensorData.y - 15)}px; left: ${truncate(aircraftSensorData.x - 15)}px;`);
  }

  function updateTrace() {
    let points = "";

    for (let i = 0, length = tracePoints.length; i < length; i++) {
      points += `${truncate(tracePoints[i].x)},${truncate(tracePoints[i].y)} `;
    }

    aircraftTraceLines.setAttribute("points", points);
  }

  function getWindText(heading, speed) {
    if (heading < 100) {
      if (heading < 10) {
        heading = "00" + heading;
      }
      else {
        heading = "0" + heading;
      }
    }

    if (speed < 10) {
      speed = "0" + speed;
    }

    return `${heading}${speed}KT`;
  }

  function showUserWind() {
    const windHeading = Math.round((Math.atan2(windStart.y - windEnd.y, windStart.x - windEnd.x) * CONST_TO_DEGREE + 450) % 360);

    userWindLine.setAttribute("x1", windStart.x);
    userWindLine.setAttribute("x2", windEnd.x);
    userWindLine.setAttribute("y1", windStart.y);
    userWindLine.setAttribute("y2", windEnd.y);

    setElementStyle(userWindArrowTip, `transform: ${getCssTransformFragmentForTranslate(windEnd.x, windEnd.y)} ${getCssTransformFragmentForRotate(windHeading + 180)}`);

    setElementVisibility(userWind, true);
  }

  function hideUserWind() {
    setElementVisibility(userWind, false);
  }

  function updateUserWind() {
    if (windStart !== undefined && windEnd !== undefined) {
      showUserWind();
    }
    else {
      hideUserWind();
    }
  }

  function updateWindArrow() {
    setElementStyle(informationDisplayWindArrowGraphic, `transform: ${getCssTransformFragmentForRotate(windHdg + 180)}`);
  }

  function updateMovingMapNavaid(navaid, navaidGraphic, selectedCourse) {
    const navaidPosition = navaid.getPosition();

    navaidGraphic.querySelectorAll(".navaid__option").forEach(x => setElementVisibility(x, false));

    setElementStyle(navaidGraphic, `transform: ${getCssTransformFragmentForTranslate(navaidPosition.x, navaidPosition.y)}`);

    const deviationAndObsElement = navaidGraphic.querySelector(".navaid__deviationAndObs");

    setElementVisibility(deviationAndObsElement, navaid.isOmnidirectional());

    if (navaid.isOmnidirectional()) {
      setElementStyle(deviationAndObsElement, `transform: ${getCssTransformFragmentForRotate(selectedCourse)}`);
    }

    setElementVisibility(navaidGraphic.querySelector(`.${navaid.getType()}`), true);
  }

  function update(timestampNow) {
    const elapsed = (timestampNow - timestampStart) * simRate,
      navaid1Position = navaid1.getPosition(),
      navaid2Position = navaid2.getPosition(),
      aircraftSensorData = aircraft.getSensorData();

    timestampStart = timestampNow;

    if (!paused) {
      traceTimer += elapsed;

      if (traceTimer > 1000) {
        tracePoints.push({ x: aircraftSensorData.x, y: aircraftSensorData.y });

        traceTimer %= 1000;
      }

      if (keys[" "] !== undefined) {
        aircraft.stopTurn();
      }

      if (keys["ARROWLEFT"] !== undefined) {
        aircraft.turnLeft(keys["CONTROL"] !== undefined);
      }

      if (keys["ARROWUP"] !== undefined) {
        aircraft.increaseSpeed();
      }

      if (keys["ARROWRIGHT"] !== undefined) {
        aircraft.turnRight(keys["CONTROL"] !== undefined);
      }

      if (keys["ARROWDOWN"] !== undefined) {
        aircraft.decreaseSpeed();
      }

      aircraft.update(elapsed, navaid1, navaid2, windHdg, windSpeed);
    }

    if (hideWhat === 0 || hideWhat === 2) {
      if (showTrace) {
        updateTrace();
      }

      updateMovingMapAircraft(aircraftSensorData);
    }

    if (draggableObjectHandle) {
      updateMovingMapNavaid(navaid1, movingMapNavaid1, hsiCourse);
      updateNavaidHandle(navaid1Position, navaid1Handle);

      updateMovingMapNavaid(navaid2, movingMapNavaid2, cdiCourse);
      updateNavaidHandle(navaid2Position, navaid2Handle);
    }

    asi.update(aircraftSensorData);
    turnCoordinator.update(aircraftSensorData);
    hsi.update(elapsed, aircraftSensorData, navaid1);
    cdi.update(elapsed, aircraftSensorData, navaid2);
    rmi.update(elapsed, aircraftSensorData, navaid1, navaid2);

    debugInformation.update(aircraftSensorData, navaid1Position, navaid2Position);

    if (drawNavaidHelpers) {
      aircraftCourseToNavaid1.setAttribute("x1", truncate(aircraftSensorData.x));
      aircraftCourseToNavaid1.setAttribute("x2", truncate(navaid1Position.x));
      aircraftCourseToNavaid1.setAttribute("y1", truncate(aircraftSensorData.y));
      aircraftCourseToNavaid1.setAttribute("y2", truncate(navaid1Position.y));

      aircraftCourseToNavaid2.setAttribute("x1", truncate(aircraftSensorData.x));
      aircraftCourseToNavaid2.setAttribute("x2", truncate(navaid2Position.x));
      aircraftCourseToNavaid2.setAttribute("y1", truncate(aircraftSensorData.y));
      aircraftCourseToNavaid2.setAttribute("y2", truncate(navaid2Position.y));
    }

    animFrame(update);
  }

  function updateNavaidHandle(navaidPosition, navaidHandle) {
    setElementStyle(navaidHandle, `top:${truncate(navaidPosition.y - 15)}px; left: ${truncate(navaidPosition.x - 15)}px;`);
  }

  function updateHandleVisibility() {
    setElementVisibilityViaClass(aircraftHandle, "mouseEventsSurface__draggableObjectHandle_hidden", hideWhat === 0 || hideWhat === 2);
    setElementsVisibilityViaClass(navaidHandles, "mouseEventsSurface__draggableObjectHandle_hidden", hideWhat < 2);
  }

  animFrame(update);

  function documentKeydownHandler(event) {
    var key = event.key.toUpperCase();

    if (key === "1") {
      navaid1.cycleType();

      updateMovingMapNavaid(navaid1, movingMapNavaid1, hsiCourse);

      return;
    }

    if (key === "2") {
      navaid2.cycleType();

      updateMovingMapNavaid(navaid2, movingMapNavaid2, cdiCourse);

      return;
    }

    if (key === "H") {
      hideWhat = (hideWhat + 1) % 4;

      setElementVisibilityViaClass(movingMapAircraft, "movingMap__aircraft_hidden", hideWhat === 0 || hideWhat === 2);
      setElementVisibilityViaClass(movingMapNavaid1, "navaid__graphics_hidden", hideWhat < 2);
      setElementVisibilityViaClass(movingMapNavaid2, "navaid__graphics_hidden", hideWhat < 2);

      updateHandleVisibility();

      return;
    }

    if (key === "L") {
      const newPositionX = Math.random() * 700 + 50,
        newPositionY = Math.random() * 450 + 50;

      aircraft.setPosition(newPositionX, newPositionY);

      tracePoints = [];

      tracePoints.push({ x: newPositionX, y: newPositionY });

      return;
    }

    if (key === "O") {
      drawNavaidHelpers = !drawNavaidHelpers;

      setElementsVisibilityViaClass(navaidDeviationAndObsElements, "navaid__deviationAndObs_hidden", drawNavaidHelpers);
      setElementsVisibilityViaClass(aircraftCourseToNavaidElements, "aircraftCourseToNavaid__line_hidden", drawNavaidHelpers);

      return;
    }

    if (key === "T") {
      showTrace = !showTrace;

      setElementVisibility(aircraftTrace, showTrace);

      return;
    }

    if (key === "R") {
      simRate *= 2;
      simRate %= 31;

      informationSimRateValue.innerHTML = simRate;

      setElementVisibility(informationSimRate, simRate > 1);

      return;
    }

    if (key === "P") {
      paused = !paused;

      setElementVisibility(informationPause, paused);

      return;
    }

    if (key === "W") {
      // don't close if user is setting the wind
      if (windStart) {
        return;
      }

      windMode = !windMode;

      setElementVisibility(informationDisplayWindInstructions, windMode);

      return;
    }

    if (keys[key] === undefined) {
      keys[key] = key;
    }

    if (key === " " || key === "ARROWUP" || key === "ARROWDOWN" || key === "ARROWLEFT" || key === "ARROWRIGHT") {
      event.preventDefault();
    }
  }

  function documentKeyupHandler(event) {
    keys[event.key.toUpperCase()] = undefined;
  }

  function registerKeyboardEventHandlers() {
    document.addEventListener("keydown", documentKeydownHandler);
    document.addEventListener("keyup", documentKeyupHandler);
  }

  let mouseDownTargetOffsetX = 0,
    mouseDownTargetOffsetY;

  function mouseDownHandler(event) {
    if (event.button !== 0) {
      return;
    }

    mouseDownTargetOffsetX = 15 - event.offsetX;
    mouseDownTargetOffsetY = 15 - event.offsetY;

    if (event.target.classList.contains("mouseEventsSurface__draggableObjectHandle")) {
      draggableObjectHandle = event.target.dataset["handleFor"];

      setElementsVisibilityViaClass(mouseEventsSurfaceHandles, "mouseEventsSurface__draggableObjectHandle_hidden", false);
    }
    else if (windMode) {
      windStart = { x: event.offsetX, y: event.offsetY };
      windEnd = undefined;
      setElementsVisibilityViaClass(mouseEventsSurfaceHandles, "mouseEventsSurface__draggableObjectHandle_hidden", false);
    }
  }

  function getNewDraggablePosition(event, eventOffsetSelector, targetOffset) {
    const threshold = 15;

    if (event[eventOffsetSelector] + targetOffset > 1200 - threshold) {
      return 1200 - threshold;
    }
    else if (event[eventOffsetSelector] + targetOffset < threshold) {
      return threshold;
    }

    return event[eventOffsetSelector] + targetOffset;
  }

  function mouseMoveHandler(event) {
    if (draggableObjectHandle) {
      let draggable;

      if (draggableObjectHandle === "navaid1") {
        draggable = navaid1;
      }
      else if (draggableObjectHandle === "navaid2") {
        draggable = navaid2;
      }
      else if (draggableObjectHandle === "aircraft") {
        draggable = aircraft;

        tracePoints = [];
      }

      draggable.setPosition(getNewDraggablePosition(event, "offsetX", mouseDownTargetOffsetX), getNewDraggablePosition(event, "offsetY", mouseDownTargetOffsetY));
    }
    else if (windStart) {
      if (!windEnd && event.movementX === 0 && event.movementY === 0) {
        return;
      }

      windEnd = { x: event.offsetX, y: event.offsetY };

      updateUserWind();
    }
  }

  function mouseUpHandler(event) {
    updateHandleVisibility();

    if (draggableObjectHandle) {
      draggableObjectHandle = undefined;
    }

    if (!windStart) {
      return;
    }

    if (!windEnd) {
      windStart = undefined;

      windSpeed = 0;

      setElementVisibility(informationDisplayWind, false);
    }
    else {
      windHdg = Math.round((Math.atan2(windStart.y - windEnd.y, windStart.x - windEnd.x) * CONST_TO_DEGREE + 450) % 360);

      windSpeed = Math.round(Math.sqrt(Math.pow(windEnd.y - windStart.y, 2) + Math.pow(windEnd.x - windStart.x, 2)) / 20);

      informationDisplayWindValue.innerHTML = getWindText(windHdg, windSpeed);

      updateWindArrow();

      windStart = undefined;
      windEnd = undefined;

      updateUserWind();

      setElementVisibility(informationDisplayWind, true);
    }

    event.stopPropagation();
  }

  function documentMouseUpHandler(event) {
    if (windStart || draggableObjectHandle) {
      mouseUpHandler(event);
    }
  }

  function registerMouseEventHandlers() {
    document.querySelector(".mouseEventsSurface").addEventListener("mousedown", mouseDownHandler);
    document.querySelector(".mouseEventsSurface").addEventListener("mouseup", mouseUpHandler);
    document.querySelector(".mouseEventsSurface").addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", documentMouseUpHandler);
  }

  function initElements() {
    asi = new Asi(document.querySelector(".instrumentAsi"));
    turnCoordinator = new Tc(document.querySelector(".instrumentTc"));
    hsi = new Hsi(document.querySelector(".instrumentHsi"));
    cdi = new Cdi(document.querySelector(".instrumentCdi"));
    rmi = new Rmi(document.querySelector(".instrumentRmi"));
    debugInformation = new DebugInformation();
    movingMap = document.querySelector(".movingMap");
    aircraftTrace = document.querySelector(".aircraftTrace");
    aircraftTraceLines = document.querySelector(".aircraftTrace__traceLines");
    movingMapNavaid1 = movingMap.querySelector(".movingMap__navaid_number_1 .navaid__graphics");
    movingMapNavaid2 = movingMap.querySelector(".movingMap__navaid_number_2 .navaid__graphics");
    movingMapAircraft = movingMap.querySelector(".movingMap__aircraft");
    informationSimRate = document.querySelector(".informationDisplay__simRate");
    informationSimRateValue = informationSimRate.querySelector(".informationDisplay__simRateValue");
    informationPause = document.querySelector(".informationDisplay__pause");
    informationDisplayWind = document.querySelector(".informationDisplay__wind");
    informationDisplayWindInstructions = document.querySelector(".informationDisplay__windInstructions");
    informationDisplayWindArrowGraphic = document.querySelector(".informationDisplay__windArrowGraphic");
    informationDisplayWindValue = document.querySelector(".informationDisplay__windValue");
    userWind = document.querySelector(".userWind");
    userWindLine = document.querySelector(".userWind__line");
    userWindArrowTip = document.querySelector(".userWind__arrowTip");
    mouseEventsSurfaceHandles = document.querySelectorAll(".mouseEventsSurface__draggableObjectHandle");
    aircraftHandle = document.querySelector(".mouseEventsSurface__draggableObjectHandle[data-handle-for=aircraft]");
    navaid1Handle = document.querySelector(".mouseEventsSurface__draggableObjectHandle[data-handle-for=navaid1]");
    navaid2Handle = document.querySelector(".mouseEventsSurface__draggableObjectHandle[data-handle-for=navaid2]");
    navaidHandles = [navaid1Handle, navaid2Handle];
    navaidDeviationAndObsElements = [movingMapNavaid1.querySelector(".navaid__deviationAndObs"), movingMapNavaid2.querySelector(".navaid__deviationAndObs")];
    aircraftCourseToNavaid1 = document.querySelector(".aircraftCourseToNavaid__line_navaid1");
    aircraftCourseToNavaid2 = document.querySelector(".aircraftCourseToNavaid__line_navaid2");
    aircraftCourseToNavaidElements = [aircraftCourseToNavaid1, aircraftCourseToNavaid2];

    hsi.registerObsHandleEventCallback(event => {
      hsiCourse = event;

      updateMovingMapNavaid(navaid1, movingMapNavaid1, hsiCourse);
    });

    cdi.registerObsHandleEventCallback(event => {
      cdiCourse = event;

      updateMovingMapNavaid(navaid2, movingMapNavaid2, cdiCourse);
    });
  }

  function init() {
    const aircraftSensorData = aircraft.getSensorData();

    registerKeyboardEventHandlers();

    registerMouseEventHandlers();

    initElements();

    updateMovingMapAircraft(aircraftSensorData);

    updateMovingMapNavaid(navaid1, movingMapNavaid1, 0);
    updateNavaidHandle(navaid1.getPosition(), navaid1Handle);

    updateMovingMapNavaid(navaid2, movingMapNavaid2, 0);
    updateNavaidHandle(navaid2.getPosition(), navaid2Handle);

    setElementVisibility(movingMap, true);

    tracePoints.push({ x: aircraftSensorData.x, y: aircraftSensorData.y });

    setElementVisibility(document.querySelector(".navsim"), true);
  }

  document.addEventListener("DOMContentLoaded", init, { passive: true });

  aircraft.init(navaid1, navaid2);
})();
