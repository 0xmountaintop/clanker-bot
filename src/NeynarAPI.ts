import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class NeynarAPIManager {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.neynar.com/v2';

  constructor() {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      throw new Error('NEYNAR_API_KEY environment variable is required');
    }
    this.apiKey = apiKey;
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
      const signerUuid = process.env.NEYNAR_SIGNER_UUID;
      if (!signerUuid) {
        throw new Error('NEYNAR_SIGNER_UUID environment variable is required');
      }

      await axios.post(
        `${this.baseUrl}/farcaster/cast`,
        {
          signer_uuid: signerUuid,
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