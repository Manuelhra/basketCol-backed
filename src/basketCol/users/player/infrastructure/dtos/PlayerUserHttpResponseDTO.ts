import { UserHttpResponseDTO } from '../../../shared/infrastructure/dtos/UserHttpResponseDTO';

interface IPlayerUserCredentials {
  nickname: string;
}

export interface PlayerUserHttpResponseDTO extends UserHttpResponseDTO, IPlayerUserCredentials {}
