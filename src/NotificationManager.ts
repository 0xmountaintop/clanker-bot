import notifier from 'node-notifier';
import fs from 'fs/promises';
import path from 'path';
import { TokenDict } from './types';

export class NotificationManager {
  private readonly cacheFile: string;

  constructor(cacheFile: string = 'notified_tokens.json') {
    this.cacheFile = cacheFile;
  }

  async loadCache(): Promise<string[]> {
    try {
      const data = await fs.readFile(this.cacheFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async saveCache(cache: string[]): Promise<void> {
    await fs.writeFile(this.cacheFile, JSON.stringify(cache, null, 2));
  }

  sendNotification(title: string, message: string, url: string): void {
    notifier.notify({
      title,
      message,
      open: url,
      sound: true,
      wait: true
    });
  }

  async processNewTokens(tokens: TokenDict[]): Promise<void> {
    const cache = await this.loadCache();
    const newTokens = tokens.filter(token => {
      const creatorData = token.creator;
      const userData = creatorData.neynarData?.user;
      
      const followerCount = userData?.follower_count ?? 0;
      const neynarScore = userData?.experimental?.neynar_user_score ?? 0;
      
      return (
        followerCount > 5000 &&
        neynarScore > 0.5 &&
        !cache.includes(token.contractAddress)
      );
    });

    for (const token of newTokens) {
      const username = token.creator.username ?? 'Unknown';
      const followerCount = token.creator.neynarData?.user?.follower_count ?? 0;

      console.log(
        'New Token Created!',
        `${username} created a token: ${token.name} with ${followerCount} followers.`,
        token.links.dexscreener
      );

      this.sendNotification(
        'New Token Created!',
        `${username} created a token: ${token.name} with ${followerCount} followers.`,
        token.links.dexscreener
      );

      cache.push(token.contractAddress);
    }

    await this.saveCache(cache);
  }
} 