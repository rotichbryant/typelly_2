import { RedirectifauthMiddleware } from './redirectifauth.middleware';

describe('RedirectifauthMiddleware', () => {
  it('should be defined', () => {
    expect(new RedirectifauthMiddleware()).toBeDefined();
  });
});
