import { SimNode, SimConfig } from '../types';

/**
 * Gravity Scoring Function:
 *
 *              (1 - L_i) · exp(-λ · (T_now - T_last))
 *   G_i  =  ───────────────────────────────────────────
 *              ‖V_local - V_i‖^β + ε
 *
 * - Confidence Factor: exp(-λ·ΔT) decays availability for stale data
 * - Distance Penalty: favors nearby nodes to minimize RTT
 * - Load Factor: prioritizes computationally free resources
 */
export function gravity(
  nodes: SimNode[],
  sourceId: string,
  config: SimConfig,
  simTime: number
): { targetId: string; log: string } {
  const source = nodes.find(n => n.id === sourceId)!;
  let bestNode = nodes[0];
  let bestScore = -Infinity;
  const scores: string[] = [];

  for (const node of nodes) {
    // Distance from source to candidate
    const dx = source.x - node.x;
    const dy = source.y - node.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Load factor: (1 - reportedLoad) — uses the (potentially stale) reported load
    const loadFactor = 1 - node.reportedLoad;

    // Confidence decay: exp(-λ · ΔT)
    const deltaT = simTime - node.lastGossipTime;
    const confidence = Math.exp(-config.paranoia * deltaT);

    // Gravity score
    const distancePenalty = Math.pow(distance, config.distanceExponent) + config.epsilon;
    const score = (loadFactor * confidence) / distancePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestNode = node;
    }

    scores.push(
      `  ${node.id}: G = (${loadFactor.toFixed(2)} × ${confidence.toFixed(3)}) / ${distancePenalty.toFixed(1)} = ${score.toExponential(2)}`
    );
  }

  const log = [
    `Score = Availability / Distance^${config.distanceExponent}`,
    `  Availability = (1 - Load) × exp(-λ·ΔT)`,
    `  λ = ${config.paranoia}, β = ${config.distanceExponent}`,
    `  Best → node ${bestNode.id}  (G = ${bestScore.toExponential(2)})`,
  ].join('\n');

  return { targetId: bestNode.id, log };
}
