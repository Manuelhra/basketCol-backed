import { convictConfig } from '../config';
import { App } from './App';

try {
  const port: string = convictConfig.get('server.port');

  const app: App = new App();
  app.start(port);
} catch (error) {
  console.log(error);
  process.exit(1);
}

process.on('uncaughtException', (error: Error) => {
  console.log('uncaughtException', error);
  process.exit(1);
});
