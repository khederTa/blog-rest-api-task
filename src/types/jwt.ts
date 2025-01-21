import { Request } from "express-serve-static-core";

export interface JwtPayload {
  userId: string;
  role: string;
}

export interface AuthenticatedRequest<
  Params = { id: string },
  ResBody = {},
  ReqBody = {},
  ReqQuery = { limit: string; page: string }
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  userId?: string;
  role?: string;
}
