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

  // ---- Drag & Pinch state ----
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startTx = 0;
  let startTy = 0;

  const activePointers = new Map();
  let initialPinchDiff = -1;
  let initialPinchScale = 1;
  let initialPinchTx = 0;
  let initialPinchTy = 0;

  function getDistance(p1, p2) {
    const dx = p1.clientX - p2.clientX;
    const dy = p1.clientY - p2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getMidpoint(p1, p2) {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2
    };
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function applyTransform() {
    content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function clampToBounds() {
    const v = viewport.getBoundingClientRect();
    const c = content.getBoundingClientRect();

    const isRotated = window.innerWidth <= 768;
    const vWidth = isRotated ? v.height : v.width;
    const vHeight = isRotated ? v.width : v.height;
    const cWidth = isRotated ? c.height : c.width;
    const cHeight = isRotated ? c.width : c.height;

    const minTx = vWidth - cWidth;
    const minTy = vHeight - cHeight;

    if (cWidth <= vWidth) tx = (vWidth - cWidth) / 2;
    else tx = clamp(tx, minTx, 0);

    if (cHeight <= vHeight) ty = (vHeight - cHeight) / 2;
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
    const isRotated = window.innerWidth <= 768;
    const vWidth = isRotated ? v.height : v.width;
    const vHeight = isRotated ? v.width : v.height;

    const cx = vWidth / 2;
    const cy = vHeight / 2;

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

  // ---- Drag pan & Pinch zoom ----
  viewport.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".hotspot")) return;
    activePointers.set(e.pointerId, e);

    if (activePointers.size === 1) {
      isDragging = true;
      content.classList.add("dragging");

      startX = e.clientX;
      startY = e.clientY;
      startTx = tx;
      startTy = ty;

      viewport.setPointerCapture(e.pointerId);
    } else if (activePointers.size === 2) {
      isDragging = false;
      const pointers = Array.from(activePointers.values());
      initialPinchDiff = getDistance(pointers[0], pointers[1]);
      initialPinchScale = scale;
      initialPinchTx = tx;
      initialPinchTy = ty;
    }
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId, e);

    if (activePointers.size === 1 && isDragging) {
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;

      if (window.innerWidth <= 768) {
        // Rotate dragging deltas for 90deg clockwise container rotation
        const temp = dx;
        dx = dy;
        dy = -temp;
      }

      tx = startTx + dx;
      ty = startTy + dy;
      applyTransform();
    } else if (activePointers.size === 2) {
      const pointers = Array.from(activePointers.values());
      const currentDiff = getDistance(pointers[0], pointers[1]);
      if (initialPinchDiff > 0 && currentDiff > 0) {
        const factor = currentDiff / initialPinchDiff;
        const prevScale = scale;
        scale = clamp(initialPinchScale * factor, MIN_SCALE, MAX_SCALE);

        // Zoom towards midpoint of two fingers
        const mid = getMidpoint(pointers[0], pointers[1]);
        const v = viewport.getBoundingClientRect();
        
        let mx = mid.x - v.left;
        let my = mid.y - v.top;

        if (window.innerWidth <= 768) {
          // Rotate midpoint for 90deg container rotation
          const temp = mx;
          mx = my;
          my = v.width - temp;
        }

        tx = mx - (mx - initialPinchTx) * (scale / prevScale);
        ty = my - (my - initialPinchTy) * (scale / prevScale);

        applyTransform();
        clampToBounds();
        applyTransform();
        updateHotspotVisibility();
        updateLabelScale();
        updateHotspotBorderScale();
      }
    }
  });

  const handlePointerUp = (e) => {
    if (activePointers.has(e.pointerId)) {
      activePointers.delete(e.pointerId);
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (activePointers.size < 2) {
      initialPinchDiff = -1;
    }

    if (activePointers.size === 0) {
      if (isDragging) {
        isDragging = false;
        content.classList.remove("dragging");
        clampToBounds();
        applyTransform();
      }
    } else if (activePointers.size === 1) {
      // Transition back to panning with the single remaining pointer
      const remaining = Array.from(activePointers.values())[0];
      isDragging = true;
      content.classList.add("dragging");
      startX = remaining.clientX;
      startY = remaining.clientY;
      startTx = tx;
      startTy = ty;
    }
  };

  viewport.addEventListener("pointerup", handlePointerUp);
  viewport.addEventListener("pointercancel", handlePointerUp);

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
    const isRotated = window.innerWidth <= 768;
    const vWidth = isRotated ? v.height : v.width;
    const vHeight = isRotated ? v.width : v.height;

    // x,y are 0–1 percentages of the map image
    tx = (vWidth / 2) - (x * content.offsetWidth * scale);
    ty = (vHeight / 2) - (y * content.offsetHeight * scale);
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
