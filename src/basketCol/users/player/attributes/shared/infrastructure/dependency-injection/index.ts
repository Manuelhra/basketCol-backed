import { DependencyContainerNotInitializedError } from '../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixPlayerUserAttributesDependencyInjector } from './awilix/AwilixPlayerUserAttributesDependencyInjector';

const awilixPlayerUserAttributesContainer = AwilixPlayerUserAttributesDependencyInjector.create().getContainer();

if (awilixPlayerUserAttributesContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController = awilixPlayerUserAttributesContainer.resolve('bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController');
export const playerUserAttributesRouteManager = awilixPlayerUserAttributesContainer.resolve('playerUserAttributesRouteManager');
export const getPlayerUserAttributeCategoriesGETController = awilixPlayerUserAttributesContainer.resolve('getPlayerUserAttributeCategoriesGETController');
