import { SimNode } from '../types';

// Simple hash function for consistent hashing ring
function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return hash >>> 0;
}

interface RingEntry {
  hash: number;
  nodeId: string;
}

let ring: RingEntry[] = [];
let ringNodeIds: string[] = [];
const VNODES = 50; // Virtual nodes per physical node

function buildRing(nodes: SimNode[]) {
  const ids = nodes.map(n => n.id).sort();
  // Rebuild only if nodes changed
  if (ids.join(',') === ringNodeIds.join(',')) return;
  ringNodeIds = ids;

  ring = [];
  for (const node of nodes) {
    for (let v = 0; v < VNODES; v++) {
      ring.push({ hash: simpleHash(`${node.id}-vn${v}`), nodeId: node.id });
    }
  }
  ring.sort((a, b) => a.hash - b.hash);
}

export function consistentHashing(
  nodes: SimNode[],
  _sourceId: string,
  taskId?: string
): { targetId: string; log: string } {
  buildRing(nodes);

  const key = taskId || `task-${Date.now()}-${Math.random()}`;
  const keyHash = simpleHash(key);

  // Find first ring entry with hash >= keyHash (binary search)
  let lo = 0, hi = ring.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (ring[mid].hash < keyHash) lo = mid + 1;
    else hi = mid;
  }
  const idx = lo >= ring.length ? 0 : lo;
  const target = ring[idx];

  return {
    targetId: target.nodeId,
    log: `hash("${key.slice(0, 12)}…") = ${keyHash}  →  ring[${idx}]  →  node ${target.nodeId}`,
  };
}
