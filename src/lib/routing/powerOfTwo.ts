import { SimNode } from '../types';

export function powerOfTwo(nodes: SimNode[], _sourceId: string): { targetId: string; log: string } {
  const i = Math.floor(Math.random() * nodes.length);
  let j = Math.floor(Math.random() * nodes.length);
  while (j === i && nodes.length > 1) {
    j = Math.floor(Math.random() * nodes.length);
  }

  const a = nodes[i];
  const b = nodes[j];

  // P2C uses reportedLoad (which can be stale), NOT actualLoad
  const target = a.reportedLoad <= b.reportedLoad ? a : b;
  const log = `pick = min(load[${i}]=${a.reportedLoad.toFixed(2)}, load[${j}]=${b.reportedLoad.toFixed(2)})  →  node ${target.id}`;

  return { targetId: target.id, log };
}
