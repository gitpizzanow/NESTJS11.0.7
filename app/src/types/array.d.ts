interface Array<T> {
  asyncForEach(this: T[], callback: (value: T, index: number, array: T[]) => Promise<void>): Promise<void>;
  shuffle(this: T[]): T[];
}
