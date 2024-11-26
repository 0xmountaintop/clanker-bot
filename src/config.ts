import dotenv from 'dotenv';

dotenv.config();

const waitTime = parseInt(process.env.WAIT_TIME || '5000')
const neynarApiKey = process.env.NEYNAR_API_KEY;
const neynarSignerUUID = process.env.NEYNAR_SIGNER_UUID;

export { neynarApiKey, neynarSignerUUID, waitTime}