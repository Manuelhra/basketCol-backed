import {
  ILeagueSeasonAwardsPrimitives,
  ILeagueSeasonAwardsRepository,
  LeagueSeasonAwards,
  LeagueSeasonAwardsId,
  LSALeagueSeasonId,
  Nullable,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { MongooseClientFactory } from '../../../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueSeasonAwardsSchema } from './mongoose-league-season-awards.schema';
import { IMongooseLeagueSeasonAwardsDocument } from './IMongooseLeagueSeasonAwardsDocument';

export class MongooseLeagueSeasonAwardsRepository
  extends MongooseRepository<ILeagueSeasonAwardsPrimitives, LeagueSeasonAwards>
  implements ILeagueSeasonAwardsRepository {
  protected collectionName(): string {
    return 'league_season_awards_competition';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueSeasonAwardsSchema,
    });
  }

  public static create(): MongooseLeagueSeasonAwardsRepository {
    return new MongooseLeagueSeasonAwardsRepository();
  }

  public async findById(leagueSeasonAwardsId: LeagueSeasonAwardsId): Promise<Nullable<LeagueSeasonAwards>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonAwardsDocument> = await MyModel.findOne<IMongooseLeagueSeasonAwardsDocument>({ id: leagueSeasonAwardsId.value });
    return document === null ? null : this.#mapDocumentToLeagueSeasonAwards(document);
  }

  public async findByLeagueSeasonId(leagueSeasonId: LSALeagueSeasonId): Promise<Nullable<LeagueSeasonAwards>> {
    const MyModel = await this.model();
    const document: Nullable<IMongooseLeagueSeasonAwardsDocument> = await MyModel.findOne<IMongooseLeagueSeasonAwardsDocument>({ leagueSeasonId: leagueSeasonId.value });
    return document === null ? null : this.#mapDocumentToLeagueSeasonAwards(document);
  }

  public save(leagueSeason: LeagueSeasonAwards): Promise<void> {
    return this.persist(leagueSeason);
  }

  #mapDocumentToLeagueSeasonAwards(document: IMongooseLeagueSeasonAwardsDocument): LeagueSeasonAwards {
    return LeagueSeasonAwards.fromPrimitives(
      document.id.valueOf(),
      document.bestThreePointShooterId.valueOf(),
      document.bestTwoPointShooterId.valueOf(),
      document.bestFreeThrowShooterId.valueOf(),
      document.bestAssistProviderId.valueOf(),
      document.bestOffensiveRebounderId.valueOf(),
      document.bestDefensiveRebounderId.valueOf(),
      document.mostValuablePlayerId.valueOf(),
      document.championTeamId.valueOf(),
      document.leagueSeasonId.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
