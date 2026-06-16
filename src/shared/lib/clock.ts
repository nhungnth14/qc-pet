import { storage } from './storage';

const CLOCK_OFFSET_KEY = 'clock_offset';

export interface ISystemClock {
  now(): number;
}

class ServerOffsetClock implements ISystemClock {
  private clockOffset: number;

  constructor() {
    const stored = storage.getItem<number>(CLOCK_OFFSET_KEY);
    this.clockOffset = Number.isFinite(stored) ? (stored as number) : 0;
  }

  now(): number {
    return Date.now() + this.clockOffset;
  }

  updateOffset(serverTime: number): void {
    this.clockOffset = serverTime - Date.now();
    storage.setItem(CLOCK_OFFSET_KEY, this.clockOffset);
  }
}

export class MockClock implements ISystemClock {
  constructor(private fixedTime: number) {}

  now(): number {
    return this.fixedTime;
  }
}

export const clock = new ServerOffsetClock();
