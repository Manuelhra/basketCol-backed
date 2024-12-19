import { Request, Response } from 'express';
import { HttpStatus, PlayerUser } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase } from '../../../../application/use-cases/ports/IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase';
import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';

interface Dependencies {
  readonly findLeagueSeasonAwardsByLeagueSeasonIdUseCase: IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
}

export class ExpressFindLeagueSeasonAwardsByLeagueSeasonIdGETController
implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindLeagueSeasonAwardsByLeagueSeasonIdGETController {
    return new ExpressFindLeagueSeasonAwardsByLeagueSeasonIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { leagueSeasonId } = request.params;

    const result = await this.dependencies.findLeagueSeasonAwardsByLeagueSeasonIdUseCase.execute({ leagueSeasonId });

    if (!result) {
      this.#sendEmptyResponse(response);
      return;
    }

    const awardedPlayers = this.#extractAwardedPlayers(result);
    const successResult = this.#prepareSuccessResponse(result, awardedPlayers);

    response.status(HttpStatus.OK).json(successResult);
  }

  #sendEmptyResponse(response: Response): void {
    response.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        leagueSeasonAwards: null,
      },
    });
  }

  #extractAwardedPlayers(result: NonNullable<Awaited<ReturnType<IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase['execute']>>>): Record<string, PlayerUser | undefined> {
    const { playerUserList, leagueSeasonAwards } = result;
    const { toPrimitives: awards } = leagueSeasonAwards;

    return {
      bestAssistProvider: playerUserList.find((player) => player.id.value === awards.bestAssistProviderId),
      bestDefensiveRebounder: playerUserList.find((player) => player.id.value === awards.bestDefensiveRebounderId),
      bestFreeThrowShooter: playerUserList.find((player) => player.id.value === awards.bestFreeThrowShooterId),
      bestOffensiveRebounder: playerUserList.find((player) => player.id.value === awards.bestOffensiveRebounderId),
      bestThreePointShooter: playerUserList.find((player) => player.id.value === awards.bestThreePointShooterId),
      bestTwoPointShooter: playerUserList.find((player) => player.id.value === awards.bestTwoPointShooterId),
      mostValuablePlayer: playerUserList.find((player) => player.id.value === awards.mostValuablePlayerId),
    };
  }

  #prepareSuccessResponse(
    result: NonNullable<Awaited<ReturnType<IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase['execute']>>>,
    awardedPlayers: Record<string, PlayerUser | undefined>,
  ) {
    return this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        leagueSeasonAwards: {
          ...result.leagueSeasonAwards.toPrimitives,
          leagueSeason: result.leagueSeason.toPrimitives,
          championTeam: result.championTeam.toPrimitives,
          bestAssistProvider: awardedPlayers.bestAssistProvider?.toPrimitives,
          bestDefensiveRebounder: awardedPlayers.bestDefensiveRebounder?.toPrimitives,
          bestFreeThrowShooter: awardedPlayers.bestFreeThrowShooter?.toPrimitives,
          bestOffensiveRebounder: awardedPlayers.bestOffensiveRebounder?.toPrimitives,
          bestThreePointShooter: awardedPlayers.bestThreePointShooter?.toPrimitives,
          bestTwoPointShooter: awardedPlayers.bestTwoPointShooter?.toPrimitives,
          mostValuablePlayer: awardedPlayers.mostValuablePlayer?.toPrimitives,
        },
      },
    });
  }
}
