import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new Logger('LoggerMiddleware');

  const { ip, method, originalUrl } = req;

  const userAgent = req.get('user-agent') || '';

  res.on('finish', () => {
    const { statusCode } = res;

    const contentLength = res.get('content-length');

    logger.log(
      `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
    );
  });

  next();
}
