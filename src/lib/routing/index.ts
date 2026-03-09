import { SimNode, SimConfig, AlgorithmType } from '../types';
import { roundRobin } from './roundRobin';
import { powerOfTwo } from './powerOfTwo';
import { consistentHashing } from './consistentHashing';
import { weightedLeastConn } from './weightedLeastConn';
import { gravity } from './gravity';

export function routeTask(
  algorithm: AlgorithmType,
  nodes: SimNode[],
  sourceId: string,
  config: SimConfig,
  simTime: number,
  taskId?: string
): { targetId: string; log: string } {
  switch (algorithm) {
    case 'round-robin':
      return roundRobin(nodes, sourceId);
    case 'power-of-two':
      return powerOfTwo(nodes, sourceId);
    case 'consistent-hashing':
      return consistentHashing(nodes, sourceId, taskId);
    case 'weighted-least-conn':
      return weightedLeastConn(nodes, sourceId);
    case 'gravity':
      return gravity(nodes, sourceId, config, simTime);
  }
}
