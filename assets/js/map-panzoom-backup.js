console.log("map-panzoom loaded");

(() => {
  const viewport = document.getElementById("mapViewport");
  const content = document.getElementById("mapContent");
  if (!viewport || !content) return;

  // State
  let scale = 1;
  let tx = 0;
  let ty = 0;

  const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomResetBtn = document.getElementById("zoomReset");


  const MIN_SCALE = 0.6;
  const MAX_SCALE = 3.0;

  // Drag state
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startTx = 0;
  let startTy = 0;

  function applyTransform() {
    content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // Optional: keep map from being dragged infinitely away
  function clampToBounds() {
    const v = viewport.getBoundingClientRect();
    const c = content.getBoundingClientRect();

    // If content is smaller than viewport in either dimension, keep it centered-ish.
    // Otherwise clamp edges so you can’t drag it completely offscreen.
    const minTx = v.width - c.width;
    const minTy = v.height - c.height;

    if (c.width <= v.width) {
      // center horizontally
      tx = (v.width - c.width) / 2;
    } else {
      tx = clamp(tx, minTx, 0);
    }

    if (c.height <= v.height) {
      // center vertically
      ty = (v.height - c.height) / 2;
    } else {
      ty = clamp(ty, minTy, 0);
    }
  }

  // Convert a viewport point to content-local coordinates (pre-transform)
  function viewportToContentPoint(clientX, clientY) {
    const v = viewport.getBoundingClientRect();
    const x = (clientX - v.left - tx) / scale;
    const y = (clientY - v.top - ty) / scale;
    return { x, y };
  }

  // Wheel zoom (zoom toward mouse pointer)
  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const zoomIntensity = 0.0015;
      const delta = -e.deltaY; // wheel up = positive zoom
      const zoom = Math.exp(delta * zoomIntensity);

      const prevScale = scale;
      const nextScale = clamp(scale * zoom, MIN_SCALE, MAX_SCALE);
      if (nextScale === prevScale) return;

      // Keep the point under the mouse stable
      const { x, y } = viewportToContentPoint(e.clientX, e.clientY);
      scale = nextScale;
      tx = e.clientX - viewport.getBoundingClientRect().left - x * scale;
      ty = e.clientY - viewport.getBoundingClientRect().top - y * scale;

      applyTransform();
      clampToBounds();
      applyTransform();
    },
    { passive: false }
  );

  // Drag to pan
  viewport.addEventListener("pointerdown", (e) => {
    // If you click directly on a hotspot, let it click (don’t start dragging)
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

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    tx = startTx + dx;
    ty = startTy + dy;

    applyTransform();
  });

  viewport.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    content.classList.remove("dragging");

    clampToBounds();
    applyTransform();
  });

  // Double-click to reset view
  viewport.addEventListener("dblclick", () => {
    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform();
    clampToBounds();
    applyTransform();
  });

  // Initial fit/center
  function init() {
    applyTransform();
    clampToBounds();
    applyTransform();
  }

  window.addEventListener("resize", init);
  init();


if (zoomInBtn) {
  zoomInBtn.addEventListener("click", () => {
    zoomAtCenter(1.2);
  });
}

if (zoomOutBtn) {
  zoomOutBtn.addEventListener("click", () => {
    zoomAtCenter(1 / 1.2);
  });
}

})();