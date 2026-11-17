import { about } from "../data/content";
import { CHECKPOINTS } from "./constants";

export interface CircuitStep {
  index: number;
  title: string;
  text: string;
  count: number;
  completed: boolean;
}

export interface AgentCircuit {
  /** Índices de los puntos de control ya alcanzados. */
  readonly visited: ReadonlySet<number>;
  update(x: number, z: number): void;
  reset(): void;
  dispose(): void;
}

const TRIGGER_RADIUS = 3;
const RESET_MARGIN = 1.4;

/**
 * Circuito Requerimiento → MCP → Graphify → Implementación.
 * Cada punto se activa una sola vez; hay que salir y volver a entrar para
 * volver a dispararlo, de modo que al pasar no se repita el mismo mensaje.
 */
export function createAgentCircuit(onStep: (step: CircuitStep) => void): AgentCircuit {
  const visited = new Set<number>();
  const inside = CHECKPOINTS.map(() => false);

  return {
    visited,
    update(x, z) {
      for (let i = 0; i < CHECKPOINTS.length; i += 1) {
        const checkpoint = CHECKPOINTS[i];
        const distance = Math.hypot(checkpoint.x - x, checkpoint.z - z);

        if (distance <= TRIGGER_RADIUS) {
          if (!inside[i]) {
            inside[i] = true;
            if (!visited.has(i)) {
              visited.add(i);
              const step = about.flow[i];
              onStep({
                index: i,
                title: step.title,
                text: step.text,
                count: visited.size,
                completed: visited.size === CHECKPOINTS.length,
              });
            }
          }
        } else if (distance > TRIGGER_RADIUS + RESET_MARGIN) {
          inside[i] = false;
        }
      }
    },
    reset() {
      visited.clear();
      inside.fill(false);
    },
    dispose() {
      visited.clear();
    },
  };
}
