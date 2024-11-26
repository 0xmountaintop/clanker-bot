import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { Token } from './types';

export class ClankerScraper {
  private readonly baseUrl: string = 'https://www.clanker.world/clanker';

  async getDynamicPageContent(verbose: boolean = false): Promise<string> {
    if (verbose) {
      console.log('Starting Puppeteer in headless mode...');
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();
      
      if (verbose) {
        console.log(`Loading URL: ${this.baseUrl}`);
      }

      await page.goto(this.baseUrl);
      await page.waitForSelector('.flex-1');
      await page.waitForSelector('a[href*="warpcast.com"]');

      if (verbose) {
        console.log('Page loaded successfully with creator info');
      }

      return await page.content();
    } finally {
      await browser.close();
    }
  }

  parseClankerPage(htmlContent: string, verbose: boolean = false): Token[] {
    if (verbose) {
      console.log('Starting HTML parsing...');
    }

    const $ = cheerio.load(htmlContent);
    const tokens: Token[] = [];

    $('div[class*="bg-white"][class*="rounded-lg"][class*="shadow-sm"]').each((idx, element) => {
      try {
        if (verbose) {
          console.log(`\nProcessing card ${idx + 1}...`);
        }

        const name = $(element).find('h2[class*="text-lg"]').text().trim();
        const symbol = $(element).find('p[class*="text-sm"][class*="text-gray-500"]').text().trim();
        const timeAgo = $(element).find('span[class*="text-xs"][class*="text-gray-400"]').text().trim();

        const creatorLink = $(element).find('a[href*="warpcast.com"]');
        const creatorName = creatorLink.text().trim();
        const creatorUrl = creatorLink.attr('href') || '';

        const contractAddress = $(element).find('p.break-all').attr('title') || 'Unknown';
        const imageUrl = $(element).find('img[class*="w-full"][class*="h-full"]').attr('src') || '';

        const links = $(element).find('a[href]');
        const dexscreenerUrl = links.filter((_, el) => $(el).attr('href')?.includes('dexscreener.com')).attr('href') || '';
        const basescanUrl = links.filter((_, el) => $(el).attr('href')?.includes('basescan.org')).attr('href') || '';
        const clankerPageUrl = links.filter((_, el) => $(el).attr('href')?.includes('/clanker/')).attr('href') || '';

        tokens.push({
          name,
          symbol,
          timeAgo,
          creatorName,
          creatorLink: creatorUrl,
          contractAddress,
          imageUrl,
          dexscreenerUrl,
          basescanUrl,
          clankerUrl: clankerPageUrl ? `https://www.clanker.world${clankerPageUrl}` : ''
        });

      } catch (error) {
        console.error(`Error parsing token card ${idx + 1}:`, error);
      }
    });

    return tokens;
  }
} 