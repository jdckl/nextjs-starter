import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export default async function useRateLimiter(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded
    ? (<string>forwarded).split(/, /)[0]
    : req.socket.remoteAddress;

  // 100req/day/ip
  const rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 86_400,
  });

  try {
    await rateLimiter.consume(clientIp ?? 'no-ip');
  } catch (e) {
    return res.status(429).send('Too many requests.');
  }

  next();
}
