import { Request, Response } from 'express';
import {
  HttpStatus,
  Nullable,
  PlayerUser,
  Team,
  TeamPlayer,
} from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindAllTeamActivePlayersUseCase } from '../../../../application/use-cases/ports/IFindAllTeamActivePlayersUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { TeamPlayerHttpResponseDTO } from '../../../dtos/TeamPlayerHttpResponseDTO';

type Dependencies = {
  readonly findAllTeamActivePlayersUseCase: IFindAllTeamActivePlayersUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindAllTeamActivePlayersGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindAllTeamActivePlayersGETController {
    return new ExpressFindAllTeamActivePlayersGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { teamId } = request.params;
    const result = await this.dependencies.findAllTeamActivePlayersUseCase.execute({ teamId });

    const teamPlayerList: TeamPlayerHttpResponseDTO[] = result.teamPlayers
      .map((teamPlayer) => this.#mapTeamPlayerWithPlayerUser(teamPlayer, result.teamInfo, result.playerUserList))
      .filter((teamPlayer): teamPlayer is TeamPlayerHttpResponseDTO => teamPlayer !== null);

    const responseData: { teamPlayers: TeamPlayerHttpResponseDTO[] } = {
      teamPlayers: teamPlayerList,
    };

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: responseData,
    });

    response.status(HttpStatus.OK).json(successResult);
  }

  #mapTeamPlayerWithPlayerUser(
    teamPlayer: TeamPlayer,
    team: Team,
    playerUserList: PlayerUser[],
  ): TeamPlayerHttpResponseDTO | null {
    const playerUserFound: Nullable<PlayerUser> = playerUserList.find(
      (playerUser) => playerUser.id.value === teamPlayer.toPrimitives.playerUserId,
    );

    if (!playerUserFound) return null;

    return {
      ...teamPlayer.toPrimitives,
      team: team.toPrimitives,
      playerUser: playerUserFound.toPrimitives,
    };
  }
}
