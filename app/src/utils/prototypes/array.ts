// asyncForEach
Array.prototype.asyncForEach = async function <T>(this: T[], callback: (value: T, index: number, array: T[]) => Promise<void>) {
  for (let index = 0; index < this.length; index++) {
    await callback(this[index], index, this);
  }
};

// shuffle
Array.prototype.shuffle = function <T>(this: T[]) {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};
