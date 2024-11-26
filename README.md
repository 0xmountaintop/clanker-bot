# clanker-bot

## How to Run

```
cp .env.eample .env
yarn install
node dist/index.js check
```


## Troubleshooting

https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux

You will need to install the following dependencies for Puppeteer.

```
sudo apt install ca-certificates fonts-liberation libasound2t64 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
```


## Adjust your config and strategy

1. adjust `WAIT_TIME` in `.env`
2. adjust strategy in filter in `processNewTokens`


## TODO

- [ ] Add sniper bot
- [ ] Test neynar client
- [ ] Save to file?
