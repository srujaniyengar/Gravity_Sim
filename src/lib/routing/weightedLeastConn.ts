import { SimNode } from '../types';

export function weightedLeastConn(nodes: SimNode[], _sourceId: string): { targetId: string; log: string } {
  let best = nodes[0];
  let bestScore = best.activeTasks;

  for (let i = 1; i < nodes.length; i++) {
    const score = nodes[i].activeTasks;
    if (score < bestScore) {
      bestScore = score;
      best = nodes[i];
    }
  }

  return {
    targetId: best.id,
    log: `min(active_tasks) = ${bestScore}  →  node ${best.id}`,
  };
}
