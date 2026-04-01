// assets/js/map-panzoom.js
(() => {
  const viewport = document.getElementById("mapViewport");
  const content = document.getElementById("mapContent");

  if (!viewport || !content) {
    console.log("panzoom: missing #mapViewport or #mapContent");
    return;
  }

  // ---- State ----
  let scale = 1;
  let tx = 0;
  let ty = 0;

  const MIN_SCALE = 1.0;
  const MAX_SCALE = 7.0;

  // ---- Buttons ----
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn = document.getElementById("zoomOut");
  const zoomResetBtn = document.getElementById("zoomReset");

  console.log("panzoom: buttons:", !!zoomInBtn, !!zoomOutBtn, !!zoomResetBtn);

  // ---- Drag state ----
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startTx = 0;
  let startTy = 0;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function applyTransform() {
    content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function clampToBounds() {
    const v = viewport.getBoundingClientRect();
    const c = content.getBoundingClientRect();

    const minTx = v.width - c.width;
    const minTy = v.height - c.height;

    if (c.width <= v.width) tx = (v.width - c.width) / 2;
    else tx = clamp(tx, minTx, 0);

    if (c.height <= v.height) ty = (v.height - c.height) / 2;
    else ty = clamp(ty, minTy, 0);
  }

  function viewportToContentPoint(clientX, clientY) {
    const v = viewport.getBoundingClientRect();
    const x = (clientX - v.left - tx) / scale;
    const y = (clientY - v.top - ty) / scale;
    return { x, y };
  }

  // Zoom around viewport center (for + / - buttons)
  function zoomAtCenter(factor) {
    const v = viewport.getBoundingClientRect();
    const cx = v.width / 2;
    const cy = v.height / 2;

    const prevScale = scale;
    scale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);
    if (scale === prevScale) return;

    tx = cx - (cx - tx) * (scale / prevScale);
    ty = cy - (cy - ty) * (scale / prevScale);

    applyTransform();
    clampToBounds();
    applyTransform();
    updateHotspotVisibility();
    updateLabelScale();
    updateHotspotBorderScale();



  }

  // ---- Wheel zoom (toward pointer) ----
  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const zoomIntensity = 0.004; // stronger
      const delta = -e.deltaY;
      const zoom = Math.exp(delta * zoomIntensity);

      const prevScale = scale;
      const nextScale = clamp(scale * zoom, MIN_SCALE, MAX_SCALE);
      if (nextScale === prevScale) return;

      const { x, y } = viewportToContentPoint(e.clientX, e.clientY);
      scale = nextScale;

      const v = viewport.getBoundingClientRect();
      tx = e.clientX - v.left - x * scale;
      ty = e.clientY - v.top - y * scale;

      applyTransform();
      clampToBounds();
      applyTransform();
      updateHotspotVisibility();
      updateLabelScale();
      updateHotspotBorderScale();


          console.log(
      "z:", scale.toFixed(2),
      "x:", ((viewport.clientWidth / 2 - tx) / (content.offsetWidth * scale)).toFixed(3),
      "y:", ((viewport.clientHeight / 2 - ty) / (content.offsetHeight * scale)).toFixed(3)
    );



    },
    { passive: false }
  );

  // ---- Drag pan ----
  viewport.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".hotspot")) return;
    isDragging = true;
    content.classList.add("dragging");

    startX = e.clientX;
    startY = e.clientY;
    startTx = tx;
    startTy = ty;

    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    tx = startTx + (e.clientX - startX);
    ty = startTy + (e.clientY - startY);
    applyTransform();
  });

  viewport.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    content.classList.remove("dragging");
    clampToBounds();
    applyTransform();
  });

  // Double-click reset
  viewport.addEventListener("dblclick", () => {
    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform();
    clampToBounds();
    applyTransform();
    updateHotspotVisibility();
    updateLabelScale();
    updateHotspotBorderScale();



  });

  // ---- Button listeners ----
  if (zoomInBtn) zoomInBtn.addEventListener("click", () => zoomAtCenter(1.2));
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => zoomAtCenter(1 / 1.2));
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener("click", () => {
      scale = 1;
      tx = 0;
      ty = 0;
      applyTransform();
      clampToBounds();
      applyTransform();
      updateHotspotVisibility();
      updateLabelScale();
      updateHotspotBorderScale();



    });
  }

  // ---- Init ----
  function init() {
    applyTransform();
    clampToBounds();
    applyTransform();
    updateHotspotVisibility();
    updateLabelScale();
    applyViewFromURL( )
    updateHotspotBorderScale();



  }
function updateHotspotVisibility() {
 

  const hotspots = content.querySelectorAll(".hotspot");
  hotspots.forEach((hs) => {
    const min = parseFloat(hs.dataset.min ?? "0");
    const max = parseFloat(hs.dataset.max ?? "999");

    const visible = scale >= min && scale < max;
    hs.classList.toggle("is-hidden", !visible);
  });
}

function updateLabelScale() {
  const inverse = 1 / scale;
  content.style.setProperty("--label-scale", inverse.toFixed(4));
}


// Link to Map Zoomed

function applyViewFromURL() {
  const params = new URLSearchParams(window.location.search);

  const z = parseFloat(params.get("z"));
  const x = parseFloat(params.get("x"));
  const y = parseFloat(params.get("y"));

  if (!Number.isNaN(z)) {
    scale = clamp(z, MIN_SCALE, MAX_SCALE);
  }

  if (!Number.isNaN(x) && !Number.isNaN(y)) {
    const v = viewport.getBoundingClientRect();

    // x,y are 0–1 percentages of the map image
    tx = (v.width / 2) - (x * content.offsetWidth * scale);
    ty = (v.height / 2) - (y * content.offsetHeight * scale);
  }

  applyTransform();
  clampToBounds();
  applyTransform();
  updateHotspotBorderScale();


  // If you are using these features, keep them in sync
  if (typeof updateHotspotVisibility === "function") {
    updateHotspotVisibility();
  }
  if (typeof updateLabelScale === "function") {
    updateLabelScale();
  }
}

function updateHotspotBorderScale() {
  // Inverse so border thickness stays visually constant as you zoom
  const inv = 1 / scale;
  content.style.setProperty("--hs-border-scale", inv.toFixed(4));
}

function applyTransform() {
  content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
}
function updateHotspotBorderScale() {
  // Inverse so border thickness stays visually constant as you zoom
  const inv = 1 / scale;
  content.style.setProperty("--hs-border-scale", inv.toFixed(4));
}




  window.addEventListener("resize", init);
  init();
})();
