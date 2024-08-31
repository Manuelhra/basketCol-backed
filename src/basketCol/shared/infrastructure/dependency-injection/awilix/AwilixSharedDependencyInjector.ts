import { Response } from 'express';

import { IHttpResponseHandler } from '../../../application/http/IHttpResponseHandler';
import { HttpResponseHandler } from '../../http/HttpResponseHandler';
import { ExpressSharedServerErrorHandler } from '../../server/express/server/ExpressSharedServerErrorHandler';
import { IServerErrorHandle } from '../../server/IServerErrorHandler';
import { ISharedContainer } from '../ISharedContainer';
import { AwilixDependencyInjector } from './AwilixDependencyInjector';

export class AwilixSharedDependencyInjector extends AwilixDependencyInjector<ISharedContainer> {
  public constructor() {
    super();

    this.createContainer();
    this.registerDependencies({
      expressSharedServerErrorHandler: AwilixDependencyInjector.registerAsClass<IServerErrorHandle<Response>>(ExpressSharedServerErrorHandler).singleton(),
      httpResponseHandler: AwilixDependencyInjector.registerAsClass<IHttpResponseHandler>(HttpResponseHandler).singleton(),
    });
  }
}
