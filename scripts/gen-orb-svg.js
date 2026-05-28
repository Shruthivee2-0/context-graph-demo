// Standalone SVG generator for the final-stage orb.
// Run from the repo root:  node scripts/gen-orb-svg.js > orb.svg
// Produces a static SVG that matches the rendered orb (without the
// bifrost selection pulse).

const CW = 540, CH = 540;

const COLS = {
  platform:{ f:'#dde6fa', s:'#4F7FE8' },
  core:    { f:'#cdf2e2', s:'#10B981' },
  catalog: { f:'#fde5cf', s:'#F97316' },
  payments:{ f:'#fbd5e6', s:'#EC4899' },
  testing: { f:'#e0d4f8', s:'#8B5CF6' },
  flows:   { f:'#cfeff5', s:'#06B6D4' },
  data:    { f:'#fbe9c4', s:'#F59E0B' },
};

const ORB_META = [
  // 10 primary named services (kept full names)
  {lbl:'bifrost-gateway',    c:'platform', r:14},
  {lbl:'api-catalog-service',c:'catalog',  r:12},
  {lbl:'payment-service',    c:'payments', r:11},
  {lbl:'auth-service',       c:'platform', r:12},
  {lbl:'user-service',       c:'platform', r:11},
  {lbl:'workspace-service',  c:'core',     r:13},
  {lbl:'collection-service', c:'core',     r:11},
  {lbl:'monitor-service',    c:'testing',  r:11},
  {lbl:'flows-service',      c:'flows',    r:10},
  {lbl:'insights-service',   c:'data',     r:10},
  // 9 endpoint nodes — labeled "API"
  {lbl:'API', c:'catalog',  r:7},
  {lbl:'API', c:'payments', r:7},
  {lbl:'API', c:'platform', r:7},
  {lbl:'API', c:'platform', r:7},
  {lbl:'API', c:'core',     r:7},
  {lbl:'API', c:'core',     r:7},
  {lbl:'API', c:'testing',  r:7},
  {lbl:'API', c:'flows',    r:7},
  {lbl:'API', c:'data',     r:7},
  // middle-ring stores / runners
  {lbl:'DB',  c:'platform', r:6},
  {lbl:'DB',  c:'payments', r:6},
  {lbl:'DB',  c:'core',     r:6},
  {lbl:'API', c:'testing',  r:6},
  {lbl:'API', c:'data',     r:6},
  {lbl:'DB',  c:'flows',    r:6},
  // outer-ring infrastructure
  {lbl:'API', c:'platform', r:6},
  {lbl:'API', c:'platform', r:6},
  {lbl:'DB',  c:'core',     r:6},
  {lbl:'DB',  c:'core',     r:6},
  {lbl:'DB',  c:'data',     r:6},
  {lbl:'DB',  c:'core',     r:6},
  {lbl:'API', c:'flows',    r:6},
  {lbl:'MCP', c:'catalog',  r:6},
  {lbl:'API', c:'platform', r:6},
  {lbl:'MCP', c:'testing',  r:6},
  {lbl:'MCP', c:'data',     r:7},
  {lbl:'API', c:'flows',    r:6},
  {lbl:'API', c:'platform', r:5},
  {lbl:'API', c:'platform', r:6},
  {lbl:'API', c:'platform', r:5},
  {lbl:'API', c:'data',     r:5},
  {lbl:'API', c:'platform', r:5},
  {lbl:'DB',  c:'payments', r:5},
  {lbl:'API', c:'flows',    r:5},
];

function srand(i, salt){
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function fibonacciSphere(n){
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for(let i = 0; i < n; i++){
    const y = 1 - (i/(n-1))*2;
    const r = Math.sqrt(1 - y*y);
    const theta = phi * i;
    pts.push({ px: Math.cos(theta)*r, py: y, pz: Math.sin(theta)*r });
  }
  return pts;
}

function interiorPoints(n){
  const pts = [];
  for(let i = 0; i < n; i++){
    const u = srand(i, 11);
    const v = srand(i, 23);
    const w = srand(i, 41);
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(w) * 0.85;
    pts.push({
      px: r * Math.sin(phi) * Math.cos(theta),
      py: r * Math.cos(phi),
      pz: r * Math.sin(phi) * Math.sin(theta),
    });
  }
  return pts;
}

function nearestNeighbourEdges(nodes, K){
  const edges = [];
  const seen = new Set();
  for(let i = 0; i < nodes.length; i++){
    const d = [];
    for(let j = 0; j < nodes.length; j++){
      if(j === i) continue;
      const dx = nodes[i].px - nodes[j].px;
      const dy = nodes[i].py - nodes[j].py;
      const dz = nodes[i].pz - nodes[j].pz;
      d.push([j, dx*dx + dy*dy + dz*dz]);
    }
    d.sort((a,b) => a[1] - b[1]);
    for(let k = 0; k < K && k < d.length; k++){
      const j = d[k][0];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if(seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }
  return edges;
}

// Build the orb the same way the page does
const sphere = fibonacciSphere(ORB_META.length);
const nodes = ORB_META.map((m, i) => ({
  ...m,
  px: sphere[i].px, py: sphere[i].py, pz: sphere[i].pz,
  _origR: m.r,
}));

// Swap label/colour metadata between sphere positions
function swapMeta(a, b){
  const fields = ['lbl', 'c', '_origR'];
  for(const f of fields){ const t = nodes[a][f]; nodes[a][f] = nodes[b][f]; nodes[b][f] = t; }
  nodes[a].r = nodes[a]._origR;
  nodes[b].r = nodes[b]._origR;
}
swapMeta(0, 19);   // bifrost → front-centre
swapMeta(1, 24);   // api-catalog-service
swapMeta(2, 26);   // payment-service
swapMeta(5, 29);   // workspace-service
swapMeta(6, 31);   // collection-service
swapMeta(7, 34);   // monitor-service
swapMeta(9, 37);   // insights-service

// Interior filler nodes
const TEAM_KEYS = ['catalog','payments','platform','core','testing','flows','data'];
const FILLER_COUNT = 38;
interiorPoints(FILLER_COUNT).forEach((p, i) => {
  const r = 3 + srand(i, 71) * 2;
  nodes.push({
    lbl: '',
    c: TEAM_KEYS[Math.floor(srand(i, 89) * TEAM_KEYS.length)],
    r, _origR: r,
    px: p.px, py: p.py, pz: p.pz,
  });
});

// Project to 2D (no rotation), with depth-shaded radius
nodes.forEach(n => {
  const dShade = (n.pz + 1) * 0.5;
  n.x = 0.5 + n.px * 0.36;
  n.y = 0.5 - n.py * 0.36;
  n.r = n._origR * (0.55 + dShade * 0.6);
  n.depth = n.pz;
});

const edges = nearestNeighbourEdges(nodes, 4);

// Sort indices back-to-front so the SVG renders front nodes last
const order = nodes.map((_, i) => i).sort((a, b) => nodes[a].depth - nodes[b].depth);

// ── Emit SVG ──────────────────────────────────────────────────
let svg = '';
svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CW} ${CH}" width="${CW}" height="${CH}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif">\n`;
svg += `  <rect width="${CW}" height="${CH}" fill="#ffffff"/>\n`;

// Background dot grid
svg += '  <g fill="rgba(17,17,17,0.05)">\n';
for(let x = 12; x < CW; x += 24){
  for(let y = 12; y < CH; y += 24){
    svg += `    <circle cx="${x}" cy="${y}" r="0.9"/>\n`;
  }
}
svg += '  </g>\n';

// Edges (drawn before nodes so node fills cover any lines that
// pass through their interior — opaque circles handle the rest)
svg += '  <g stroke="#e4e4e8" stroke-width="0.8">\n';
edges.forEach(([a, b]) => {
  const pa = nodes[a], pb = nodes[b];
  svg += `    <line x1="${(pa.x*CW).toFixed(2)}" y1="${(pa.y*CH).toFixed(2)}" x2="${(pb.x*CW).toFixed(2)}" y2="${(pb.y*CH).toFixed(2)}"/>\n`;
});
svg += '  </g>\n';

// Nodes (back-to-front), and labels for visible ones
svg += '  <g>\n';
order.forEach(i => {
  const n = nodes[i];
  const col = COLS[n.c] || { f: '#f5f5f7', s: '#888' };
  const cx = (n.x * CW).toFixed(2);
  const cy = (n.y * CH).toFixed(2);
  const r  = Math.max(0.5, n.r).toFixed(2);
  svg += `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${col.f}" stroke="${col.s}" stroke-width="0.9"/>\n`;
});
svg += '  </g>\n';

// Labels last, on top of everything (only if node has a non-empty label
// and its radius is large enough to read).
svg += '  <g fill="#555" text-anchor="middle" font-weight="500" font-size="9.5">\n';
order.forEach(i => {
  const n = nodes[i];
  if(!n.lbl || n.r < 4) return;
  const cx = (n.x * CW).toFixed(2);
  const cy = (n.y * CH + n.r + 11).toFixed(2);
  const isMain = n._origR >= 10;
  const fs = isMain ? 11 : 9.5;
  const fw = isMain ? 600 : 500;
  const colour = isMain ? '#111' : '#555';
  svg += `    <text x="${cx}" y="${cy}" font-size="${fs}" font-weight="${fw}" fill="${colour}">${n.lbl}</text>\n`;
});
svg += '  </g>\n';

svg += '</svg>\n';

process.stdout.write(svg);
