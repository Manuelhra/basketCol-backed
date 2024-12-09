import { Request, Response } from 'express';
import {
  HttpStatus,
  League,
  LeagueTeam,
  Nullable,
  Team,
} from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindAllLeagueTeamsByLeagueIdUseCase } from '../../../../application/use-cases/ports/IFindAllLeagueTeamsByLeagueIdUseCase';
import { LeagueTeamHttpResponseDTO } from '../../../dtos/LeagueTeamHttpResponseDTO';

type Dependencies = {
  readonly findAllLeagueTeamsByLeagueIdUseCase: IFindAllLeagueTeamsByLeagueIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindAllLeagueTeamsByLeagueIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindAllLeagueTeamsByLeagueIdGETController {
    return new ExpressFindAllLeagueTeamsByLeagueIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { leagueId } = request.params;
    const result = await this.dependencies.findAllLeagueTeamsByLeagueIdUseCase.execute({ leagueId, status: null });

    const leagueTeamList = result.leagueTeams
      .map((leagueTeam) => this.#mapLeagueTeamWithTeam(leagueTeam, result.leagueInfo, result.teamList))
      .filter((leagueTeam): leagueTeam is LeagueTeamHttpResponseDTO => leagueTeam !== null);

    const responseData: { leagueTeams: LeagueTeamHttpResponseDTO[] } = {
      leagueTeams: leagueTeamList,
    };

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: responseData,
    });

    response.status(HttpStatus.OK).json(successResult);
  }

  #mapLeagueTeamWithTeam(
    leagueTeam: LeagueTeam,
    league: League,
    teamList: Team[],
  ): LeagueTeamHttpResponseDTO | null {
    const teamFound: Nullable<Team> = teamList.find(
      (team) => team.id.value === leagueTeam.toPrimitives.teamId,
    );

    if (teamFound === null || teamFound === undefined) return null;

    return {
      ...leagueTeam.toPrimitives,
      league: league.toPrimitives,
      team: teamFound.toPrimitives,
    };
  }
}
