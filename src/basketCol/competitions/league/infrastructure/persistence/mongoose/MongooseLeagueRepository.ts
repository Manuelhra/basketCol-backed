import {
  ILeaguePrimitives,
  ILeagueRepository,
  League,
  LeagueId,
  LeagueName,
  Nullable,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongooseLeagueDocument } from './IMongooseLeagueDocument';
import { MongooseClientFactory } from '../../../../../shared/infrastructure/persistence/mongoose/MongooseClientFactory';
import { mongooseLeagueSchema } from './mongoose-league.schema';

export class MongooseLeagueRepository
  extends MongooseRepository<ILeaguePrimitives, League>
  implements ILeagueRepository {
  protected collectionName(): string {
    return 'league_competition';
  }

  private constructor() {
    super({
      mongooseClient: MongooseClientFactory.createMongooseClient(),
      mongooseSchema: mongooseLeagueSchema,
    });
  }

  public static create(): MongooseLeagueRepository {
    return new MongooseLeagueRepository();
  }

  public async searchById(leagueId: LeagueId): Promise<Nullable<League>> {
    const MyModel = await this.model();

    const document: Nullable<IMongooseLeagueDocument> = await MyModel.findOne<IMongooseLeagueDocument>({ id: leagueId.value });

    return document === null ? null : League.fromPrimitives(
      document.id.valueOf(),
      {
        short: document.name.short.valueOf(),
        official: document.name.official.valueOf(),
      },
      {
        short: document.description.short.valueOf(),
        complete: document.description.complete.valueOf(),
      },
      document.rules.valueOf(),
      document.level.valueOf(),
      {
        country: {
          code: document.location.country.code.valueOf(),
          label: document.location.country.label.valueOf(),
        },
        city: {
          code: document.location.city.code.valueOf(),
          label: document.location.city.label.valueOf(),
        },
        department: {
          code: document.location.department.code.valueOf(),
          label: document.location.department.label.valueOf(),
        },
        coords: {
          lat: document.location.coords.lat.valueOf(),
          lng: document.location.coords.lng.valueOf(),
        },
      },
      document.leagueFounderUserId.valueOf(),
      document.establishmentDate.valueOf(),
      document.isActive.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByOfficialName(leagueName: LeagueName): Promise<Nullable<League>> {
    const MyModel = await this.model();
    const officialName: string = leagueName.value.official;

    const document: Nullable<IMongooseLeagueDocument> = await MyModel.findOne<IMongooseLeagueDocument>({ 'name.official': officialName });

    return document === null ? null : League.fromPrimitives(
      document.id.valueOf(),
      {
        short: document.name.short.valueOf(),
        official: document.name.official.valueOf(),
      },
      {
        short: document.description.short.valueOf(),
        complete: document.description.complete.valueOf(),
      },
      document.rules.valueOf(),
      document.level.valueOf(),
      {
        country: {
          code: document.location.country.code.valueOf(),
          label: document.location.country.label.valueOf(),
        },
        city: {
          code: document.location.city.code.valueOf(),
          label: document.location.city.label.valueOf(),
        },
        department: {
          code: document.location.department.code.valueOf(),
          label: document.location.department.label.valueOf(),
        },
        coords: {
          lat: document.location.coords.lat.valueOf(),
          lng: document.location.coords.lng.valueOf(),
        },
      },
      document.leagueFounderUserId.valueOf(),
      document.establishmentDate.valueOf(),
      document.isActive.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public async searchByShortName(leagueName: LeagueName): Promise<Nullable<League>> {
    const MyModel = await this.model();
    const shortName: string = leagueName.value.short;

    const document: Nullable<IMongooseLeagueDocument> = await MyModel.findOne<IMongooseLeagueDocument>({ 'name.short': shortName });

    return document === null ? null : League.fromPrimitives(
      document.id.valueOf(),
      {
        short: document.name.short.valueOf(),
        official: document.name.official.valueOf(),
      },
      {
        short: document.description.short.valueOf(),
        complete: document.description.complete.valueOf(),
      },
      document.rules.valueOf(),
      document.level.valueOf(),
      {
        country: {
          code: document.location.country.code.valueOf(),
          label: document.location.country.label.valueOf(),
        },
        city: {
          code: document.location.city.code.valueOf(),
          label: document.location.city.label.valueOf(),
        },
        department: {
          code: document.location.department.code.valueOf(),
          label: document.location.department.label.valueOf(),
        },
        coords: {
          lat: document.location.coords.lat.valueOf(),
          lng: document.location.coords.lng.valueOf(),
        },
      },
      document.leagueFounderUserId.valueOf(),
      document.establishmentDate.valueOf(),
      document.isActive.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }

  public save(league: League): Promise<void> {
    return this.persist(league);
  }
}
