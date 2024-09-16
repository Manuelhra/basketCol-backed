import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixCompetitionsSharedDependencyInjector } from './awilix/AwilixCompetitionsSharedDependencyInjector';

const awilixCompetitionsSharedContainer = new AwilixCompetitionsSharedDependencyInjector().getContainer();

if (awilixCompetitionsSharedContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const competitionsSharedServerErrorHandler = awilixCompetitionsSharedContainer.resolve('competitionsSharedServerErrorHandler');
