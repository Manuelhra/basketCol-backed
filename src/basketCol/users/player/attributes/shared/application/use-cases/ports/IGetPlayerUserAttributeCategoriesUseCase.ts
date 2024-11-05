import {
  Nullable,
  PlayerUserDefensiveAttributes,
  PlayerUserFinishingAttributes,
  PlayerUserPhysicalAttributes,
  PlayerUserReboundingAttributes,
  PlayerUserShootingAttributes,
  PlayerUserSkillAttributes,
} from '@basketcol/domain';

import { IUseCase } from '../../../../../../../shared/application/use-cases/ports/IUseCase';
import { GetPlayerUserAttributeCategoriesDTO } from '../../dtos/GetPlayerUserAttributeCategoriesDTO';

export type IGetPlayerUserAttributeCategoriesUseCaseResponse = {
  defensiveAttributes: Nullable<PlayerUserDefensiveAttributes>;
  finishingAttributes: Nullable<PlayerUserFinishingAttributes>;
  physicalAttributes: Nullable<PlayerUserPhysicalAttributes>;
  reboundingAttributes: Nullable<PlayerUserReboundingAttributes>;
  shootingAttributes: Nullable<PlayerUserShootingAttributes>;
  skillAttributes: Nullable<PlayerUserSkillAttributes>;
};

export interface IGetPlayerUserAttributeCategoriesUseCase extends IUseCase<GetPlayerUserAttributeCategoriesDTO, IGetPlayerUserAttributeCategoriesUseCaseResponse> {}
