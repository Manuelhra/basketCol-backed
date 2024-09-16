export interface IConvictProps {
  env: string;
  server: {
    port: string;
  };
  mongoose: {
    uri: string;
    database: string;
  },
  jwt: {
    secretKeys: {
      authenticateUserSecretKey: string;
      refreshTokenSecretKey: string;
    }
  };
}
