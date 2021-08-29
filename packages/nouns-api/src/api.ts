import express, { Express, Request } from 'express';
import { param, validationResult } from 'express-validator';
import { getTokenMetadata } from './utils';
import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const streamKey: any = process.env.STREAM_API_KEY;
const streamSecret: any = process.env.STREAM_APP_SECRET;

/**
 * Create the express app and attach routes
 */
export const createAPI = (): Express => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.get('/', (_req, res) => {
    res.status(200).send({
      message: 'Nouns API Root',
    });
  });

  app.get(
    '/metadata/:tokenId',
    param('tokenId').isInt({ min: 0, max: 1000 }),
    async (req: Request, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      const metadata = await getTokenMetadata(req.params.tokenId);
      if (!metadata) {
        return res.status(500).send({ error: 'Failed to fetch token metadata' });
      }

      res.send(metadata);
    },
  );

  app.post('/join', async (req, res) => {
    console.log(req.body);
    const { username } = req.body;
    const serverSideClient = new StreamChat(streamKey, streamSecret);
    const token = serverSideClient.createToken(username);
    try {
      await serverSideClient.upsertUsers([
        {
          id: username,
          name: username,
        },
      ]);
    } catch (err) {
      console.log(err);
    }

    const admin = { id: 'admin' };
    const channel = serverSideClient.channel('commerce', 'live-chat', {
      name: 'Live Chat',
      created_by: admin,
    });

    try {
      await channel.create();
      await channel.addMembers([username, 'admin']);
    } catch (err) {
      console.log(err);
    }

    return res.status(200).json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
  });

  return app;
};
