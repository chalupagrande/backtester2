import { EventBus } from '@lib/EventBus';
import { Strategy } from '@lib/Strategy';
import { ExecutionProvider, PortfolioProvider } from '@lib/utils/types';

export abstract class AlgorithmRunner {
  protected strategy: Strategy;
  protected eventBus: EventBus;
  protected executionProvider: ExecutionProvider;
  protected portfolioProvider: PortfolioProvider;

  constructor({
    strategy,
    eventBus,
    executionProvider,
    portfolioProvider
  }: {
    strategy: Strategy;
    eventBus: EventBus;
    executionProvider: ExecutionProvider;
    portfolioProvider: PortfolioProvider;
  }) {
    this.strategy = strategy;
    this.eventBus = eventBus;
    this.executionProvider = executionProvider;
    this.portfolioProvider = portfolioProvider;
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract getResults(): any; // Return performance metrics
}
