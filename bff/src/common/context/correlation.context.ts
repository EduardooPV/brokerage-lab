import { AsyncLocalStorage } from 'async_hooks';
import { CorrelationStore } from '../types/correlation.types';

const storage = new AsyncLocalStorage<CorrelationStore>();

export const CorrelationContext = {
  run(correlationId: string, callback: () => void): void {
    storage.run({ correlationId }, callback);
  },

  get(): string | undefined {
    return storage.getStore()?.correlationId;
  },
};
