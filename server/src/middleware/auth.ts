import jwks from "jwks-rsa";
let { expressjwt: jwt } = require("express-jwt");
import { Request } from 'express';

const jwksCallback = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  // JWKS url from the Auth0 Tenant
  jwksUri: "https://dev-7dz8alw7.us.auth0.com/.well-known/jwks.json",
});

// Configure jwt check
export let requireJWTAuthentication = jwt({
  secret: jwksCallback,
  // The same audience parameter needs to be used by the client to configure their Auth0 SDK
  audience: "roommate",
  // The Auth0 domain
  issuer: "https://dev-7dz8alw7.us.auth0.com/",
  // Has to be RS256 because that's what Auth0 uses to sign it's tokens
  algorithms: ["RS256"],
});

export interface AuthenticatedRequest extends Request {
  user: any 
}
