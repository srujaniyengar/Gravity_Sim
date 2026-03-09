import { SimNode } from '../types';

let counter = 0;

export function roundRobin(nodes: SimNode[], _sourceId: string): { targetId: string; log: string } {
  const idx = counter % nodes.length;
  counter++;
  const target = nodes[idx];
  return {
    targetId: target.id,
    log: `target = nodes[${idx}]  // (counter++) % ${nodes.length}`,
  };
}

export function resetRoundRobin() {
  counter = 0;
}
