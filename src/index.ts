import { Command } from 'commander';
import { ClankerScraper } from './ClankerScraper';
import { NeynarAPIManager } from './NeynarAPI';
import { NotificationManager } from './NotificationManager';
import { TableDisplay } from './TableDisplay';
import { TokenDict } from './types';

const program = new Command();

async function extractWarpcastUsername(url: string | null): Promise<string | null> {
  if (!url) return null;
  return url.replace(/\/$/, '').split('/').pop() ?? null;
}

async function formatTokenDict(token: any, neynar: NeynarAPIManager): Promise<TokenDict> {
  const warpcastUsername = await extractWarpcastUsername(token.creatorLink);
  let neynarData = null;
  let ethAddresses = null;

  if (warpcastUsername) {
    try {
      neynarData = await neynar.getUserByUsername(warpcastUsername);
      ethAddresses = neynarData?.user?.verified_addresses?.eth_addresses ?? null;
    } catch (error) {
      console.error(`Error fetching Neynar data for ${warpcastUsername}:`, error);
    }
  }

  return {
    name: token.name,
    symbol: token.symbol,
    timeAgo: token.timeAgo,
    creator: {
      name: token.creatorName,
      link: token.creatorLink,
      username: warpcastUsername,
      neynarData
    },
    contractAddress: token.contractAddress,
    imageUrl: token.imageUrl,
    links: {
      dexscreener: token.dexscreenerUrl,
      basescan: token.basescanUrl,
      clanker: token.clankerUrl,
    },
    ethAddresses,
    castCount: 0
  };
}

async function checkClanker(verbose: boolean = false): Promise<void> {
  try {
    const scraper = new ClankerScraper();
    const neynar = new NeynarAPIManager();
    const notificationManager = new NotificationManager();

    if (verbose) {
      console.log('Starting Clanker check...');
    }

    const html = await scraper.getDynamicPageContent(verbose);
    const tokens = await scraper.parseClankerPage(html, verbose);
    
    // Format tokens and fetch additional data
    const tokenDicts = await Promise.all(
      tokens.map(token => formatTokenDict(token, neynar))
    );

    // Process notifications
    await notificationManager.processNewTokens(tokenDicts);

    // Display results
    TableDisplay.displayTokens(tokenDicts);

  } catch (error) {
    console.error('Error during Clanker check:', error);
    process.exit(1);
  }
}

program
  .name('clanker-bot')
  .description('CLI to track and monitor Clanker tokens')
  .version('1.0.0');

program
  .command('check')
  .description('Check and parse current Clanker tokens')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    await checkClanker(options.verbose);
  });

// Handle case when no arguments provided
if (process.argv.length === 2) {
  checkClanker(true);
} else {
  program.parse();
} 