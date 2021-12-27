const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const { redisUrl } = require("../constants/urls");

const client = redis.createClient(redisUrl);

const defaultExpireTime = 60;

function initCacheClient() {
  client.hget = util.promisify(client.hget);

  // create reference for .exec
  const exec = mongoose.Query.prototype.exec;

  // create new cache function on prototype
  mongoose.Query.prototype.cache = function (
    options = { expire: defaultExpireTime }
  ) {
    this.useCache = true;
    this.expire = options.expire;
    this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);

    return this;
  };

  // override exec function to first check cache for data
  mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
      return await exec.apply(this, arguments);
    }

    const key = JSON.stringify({
      ...this.getQuery(),
      collection: this.mongooseCollection.name,
    });

    // get cached value from redis
    const cacheValue = await client.hget(this.hashKey, key);

    // if cache value is not found, fetch data from mongodb and cache it
    if (!cacheValue) {
      const result = await exec.apply(this, arguments);
      client.hset(this.hashKey, key, JSON.stringify(result));
      client.expire(this.hashKey, this.expire || defaultExpireTime);

      console.log(`Return data from MongoDB; key ${this.hashKey}`);
      return result;
    }

    // return found cachedValue
    const doc = JSON.parse(cacheValue);
    console.log(`Return data from Redis; key ${this.hashKey}`);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  };
}

function clearCache(hashKey) {
  console.log(`Clear data from Redis; key ${hashKey}`);
  client.del(JSON.stringify(hashKey));
}

function clearAllCache() {
  console.log("Clear all data from Redis");
  client.flushdb(function (err) {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  initCacheClient,
  clearCache,
  clearAllCache,
};
