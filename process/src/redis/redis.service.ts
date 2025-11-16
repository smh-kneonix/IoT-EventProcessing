import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClientType,
  ) {}

  async set(key: string, value: any, ttl?: number) {
    const data = typeof value === 'string' ? value : JSON.stringify(value);

    if (ttl) {
      await this.redis.set(key, data, { EX: ttl });
    } else {
      await this.redis.set(key, data);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return data as any;
    }
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  async keys(pattern: string) {
    return this.redis.keys(pattern);
  }

  async addToSet(key: string, value: string) {
    await this.redis.sAdd(key, value);
  }

  async removeFromSet(key: string, value: string) {
    await this.redis.sRem(key, value);
  }

  async getSetMembers(key: string): Promise<string[]> {
    return this.redis.sMembers(key);
  }

  async saveActiveRules(rules: any[]) {
    await this.set('rules:active', rules);
  }

  async getActiveRules(): Promise<any[]> {
    return (await this.get('rules:active')) ?? [];
  }
}
