import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixCompetitionsSharedDependencyInjector } from './awilix/AwilixCompetitionsSharedDependencyInjector';

const awilixCompetitionsSharedContainer = AwilixCompetitionsSharedDependencyInjector.create().getContainer();

if (awilixCompetitionsSharedContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const competitionsSharedServerErrorHandler = awilixCompetitionsSharedContainer.resolve('competitionsSharedServerErrorHandler');
