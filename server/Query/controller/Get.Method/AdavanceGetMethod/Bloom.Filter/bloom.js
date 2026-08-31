const crypto = require('crypto');

class BloomFilter {
  constructor(size, hashCount) {
    this.size = size;
    this.hashCount = hashCount;
    this.bitArray = new Uint8Array(size);
  }

  hash(value, seed) {
    const hash = crypto.createHash("md5");
    hash.update(value + ":" + seed);
    return parseInt(hash.digest("hex"), 16) % this.size;
  }

  add(value) {
    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(value, i);
      this.bitArray[index] = 1;
    }
  }

  mightContain(value) {
    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(value, i);
      if (this.bitArray[index] === 0) return false;
    }
    return true;
  }
}

const bloom = new BloomFilter(10000, 5); // better config

module.exports = { bloom };
