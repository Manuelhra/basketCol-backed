export interface IHostUserConfigFactory {
  createHostUserCredentials(): { email: { value: string }; password: string };
}
