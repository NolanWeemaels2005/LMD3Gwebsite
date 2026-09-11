/** Coordinates use the bottom-centre anchor, keeping the fan's lower curve fixed. */
export type FanCardGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

function bounds(card: FanCardGeometry) {
  const angle = card.rotation * Math.PI / 180;
  const points = [-card.width / 2, card.width / 2].flatMap(x =>
    [-card.height, 0].map(y => ({
      x: card.x + x * Math.cos(angle) - y * Math.sin(angle),
      y: card.y + x * Math.sin(angle) + y * Math.cos(angle),
    })),
  );
  return { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)) };
}

/** Open two rigid overlapping groups around the active card's actual footprint. */
export function resolveFanGeometry(base: FanCardGeometry[], active: number | null) {
  const target = base.map(card => ({ ...card }));
  if (active === null) return { cards: target, centerX: 0 };

  const normal = base[active];
  const activeWidth = normal.width * 1.15;
  target[active] = { ...normal, width: activeWidth, height: normal.height * activeWidth / normal.width };
  const footprint = bounds(target[active]);
  // A little edge overlap keeps the opened fan connected. Unlike distance falloff,
  // every member of a side receives exactly the same displacement.
  // Strongly angled outer cards have triangular empty corners in their bounds.
  // Allow those corners to interleave without closing the readable central area.
  const edgeOverlap = normal.width * (.10 + .30 * Math.abs(active - (base.length - 1) / 2) / ((base.length - 1) / 2));
  const left = base.slice(0, active).map(bounds);
  const right = base.slice(active + 1).map(bounds);
  const leftOpening = left.length ? Math.max(0, Math.max(...left.map(b => b.right)) - footprint.left - edgeOverlap) : 0;
  const rightOpening = right.length ? Math.max(0, footprint.right - Math.min(...right.map(b => b.left)) - edgeOverlap) : 0;
  target.forEach((card, index) => {
    if (index < active) card.x -= leftOpening;
    if (index > active) card.x += rightOpening;
  });
  const originalBounds = base.map(bounds);
  const targetBounds = target.map(bounds);
  const center = (edges: ReturnType<typeof bounds>[]) =>
    (Math.min(...edges.map(b => b.left)) + Math.max(...edges.map(b => b.right))) / 2;
  return { cards: target, centerX: center(originalBounds) - center(targetBounds) };
}
