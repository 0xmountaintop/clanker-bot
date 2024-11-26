export interface Token {
  name: string;
  symbol: string;
  timeAgo: string;
  creatorName: string;
  creatorLink: string;
  contractAddress: string;
  imageUrl: string;
  dexscreenerUrl: string;
  basescanUrl: string;
  clankerUrl: string;
}

export interface TokenDict {
  name: string;
  symbol: string;
  timeAgo: string;
  creator: {
    name: string;
    link: string;
    username: string | null;
    neynarData: any;
  };
  contractAddress: string;
  imageUrl: string;
  links: {
    dexscreener: string;
    basescan: string;
    clanker: string;
  };
  ethAddresses: string[] | null;
  castCount: number;
} 