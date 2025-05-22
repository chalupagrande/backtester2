import { EventBus } from './EventBus';
import { Strategy } from './Strategy';
import { ExecutionProvider } from './ExecutionProvider';

export abstract class AlgorithmRunner {
  protected strategy: Strategy;
  protected eventBus: EventBus;
  protected executionProvider: ExecutionProvider;

  constructor({
    strategy,
    eventBus,
    executionProvider
  }: {
    strategy: Strategy;
    eventBus: EventBus;
    executionProvider: ExecutionProvider;
  }) {
    this.strategy = strategy;
    this.eventBus = eventBus;
    this.executionProvider = executionProvider;
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract getResults(): any; // Return performance metrics
}
