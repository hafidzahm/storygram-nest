import { Request } from 'express';

export type RequestCookieAuth = Request & {
  cookie: { Authentication: string };
};
