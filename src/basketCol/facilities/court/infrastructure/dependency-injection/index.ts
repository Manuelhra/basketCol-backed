import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixCourtDependencyInjector } from './awilix/AwilixCourtDependencyInjector';

const awilixCourtContainer = AwilixCourtDependencyInjector.create().getContainer();

if (awilixCourtContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const courtRouteManager = awilixCourtContainer.resolve('courtRouteManager');
export const createCourtPOSTController = awilixCourtContainer.resolve('createCourtPOSTController');
export const courtServerErrorHandler = awilixCourtContainer.resolve('courtServerErrorHandler');
export const searchAllCourtsGETController = awilixCourtContainer.resolve('searchAllCourtsGETController');
