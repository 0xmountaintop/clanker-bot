import { table } from 'table';
import { TokenDict } from './types';

export class TableDisplay {
  static displayTokens(tokens: TokenDict[]): void {
    const headers = [
      'Name',
      'Symbol',
      'Dexscreener',
      'BaseScan',
      'Clanker',
      'Warpcast',
      'Power Badge',
      'Followers',
      'Neynar Score'
    ];

    const rows = tokens.map(token => {
      const userData = token.creator.neynarData?.user ?? {};
      return [
        token.name,
        token.symbol,
        token.links.dexscreener || 'N/A',
        token.links.basescan || 'N/A',
        token.links.clanker || 'N/A',
        token.creator.link || 'N/A',
        userData.power_badge ? '✓' : '✗',
        userData.follower_count?.toString() || 'N/A',
        userData.experimental?.neynar_user_score?.toFixed(2) || 'N/A'
      ];
    });

    const config = {
      header: {
        alignment: 'center' as const,
        content: 'Clanker Tokens'
      },
      columns: headers.map(() => ({ alignment: 'left' as const }))
    };

    console.log(table([headers, ...rows], config));
  }
} 