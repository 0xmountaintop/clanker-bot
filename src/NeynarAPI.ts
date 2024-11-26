import axios from 'axios';
import { neynarApiKey, neynarSignerUUID } from './config';

export class NeynarAPIManager {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.neynar.com/v2';

  constructor() {
    if (!neynarApiKey) {
      throw new Error('NEYNAR_API_KEY environment variable is required');
    }
    this.apiKey = neynarApiKey;
  }

  async getUserByUsername(username: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/farcaster/user/search?q=${username}`, {
        headers: {
          'api_key': this.apiKey,
          'Accept': 'application/json'
        }
      });
      
      const users = response.data.result.users;
      return users.find((user: any) => user.username.toLowerCase() === username.toLowerCase());
    } catch (error) {
      console.error('Error fetching user from Neynar:', error);
      return null;
    }
  }

  async postCast(text: string): Promise<boolean> {
    try {
      if (!neynarSignerUUID) {
        throw new Error('NEYNAR_SIGNER_UUID environment variable is required');
      }

      await axios.post(
        `${this.baseUrl}/farcaster/cast`,
        {
          signer_uuid: neynarSignerUUID,
          text: text,
        },
        {
          headers: {
            'api_key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Error posting cast:', error);
      return false;
    }
  }
} 