export interface IConvictProps {
  env: string;
  server: {
    port: string;
  };
  mongoose: {
    uri: string;
    database: string;
  }
}
