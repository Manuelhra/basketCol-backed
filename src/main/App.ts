import { Router, Response } from 'express';

import { expressServerStatusRouteManager } from '../basketCol/server-status/infrastructure/dependency-injection';
import { expressSharedServerErrorHandler } from '../basketCol/shared/infrastructure/dependency-injection';
import { IServer } from '../basketCol/shared/infrastructure/server';
import { ExpressServer } from '../basketCol/shared/infrastructure/server/express/server/ExpressServer';
import { expressHostUserRouteManager } from '../basketCol/users/host/infrastructure/dependency-injection';

export class App {
  readonly #server: IServer<Router, Response>;

  constructor() {
    this.#server = new ExpressServer();

    this.setUpRoutes();
    this.handleErrors();
  }

  public start(port: string): void {
    this.#server.listen(port);
  }

  public stop(): void {
    this.#server.stop();
  }

  private setUpRoutes(): void {
    this.#server.registerRoutes([
      expressServerStatusRouteManager,
      expressHostUserRouteManager,
    ]);
  }

  private handleErrors(): void {
    this.#server.handleErrors([
      expressSharedServerErrorHandler,
    ]);
  }
}

// TODO: Lo primero que tengo que hacer es sacar el back de acá, y crear un archivo index que me exporte todos los módulos que quiero usar en el proyecto mobile y backend
// después volve a crear el pryecto mobile
// TODO: Handle error on all context file
// TODO: Quitar todo lo del back y dejar solo la capa de dominio y application acá
// publica el code en npm private y crear otro repo para backend y otro para front
// Crear el método static en todas las entidades de create y reemplazar en todos los casos de uso new por .create
// También crear en todas las entidades el método de update y crear la entidad Either
// Y todos los métodos de los casos de uso que se pasen de llamar run a execute
// Asegurarme que todos los casos de uso hereden o implementen el método execute
