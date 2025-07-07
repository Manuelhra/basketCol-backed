import {
  AnySystemUserType,
  BusinessDateDomainService,
  BusinessTimeDomainService,
  DateValueObject,
  HostUserEmail,
  HostUserType,
  IHostUserRepository,
  ILeagueFounderUserRepository,
  InvalidUserTypeError,
  IPasswordResetTokenRepository,
  IPlayerUserRepository,
  IRefereeUserRepository,
  ITeamFounderUserRepository,
  LeagueFounderUserEmail,
  LeagueFounderUserType,
  Nullable,
  PasswordResetToken,
  PlayerUserEmail,
  PlayerUserType,
  RefereeUserEmail,
  RefereeUserType,
  TeamFounderUserEmail,
  TeamFounderUserType,
  TimeValueObject,
} from '@basketcol/domain';

import { EmailSenderService } from '../../../shared/application/services/EmailSenderService';
import { RequestPasswordResetDTO } from '../dtos/RequestPasswordResetDTO';
import { IRequestPasswordResetUseCase } from './ports/IRequestPasswordResetUseCase';
import { GenerateRandomCode } from '../../../shared/application/services/GenerateRandomCodeService';
import { IUuidGenerator } from '../../../shared/application/uuid/ports/IUuidGenerator';

type Dependencies = {
  readonly playerUserRepository: IPlayerUserRepository;
  readonly hostUserRepository: IHostUserRepository;
  readonly refereeUserRepository: IRefereeUserRepository;
  readonly teamFounderUserRepository: ITeamFounderUserRepository;
  readonly leagueFounderUserRepository: ILeagueFounderUserRepository;
  readonly generateRandomCode: GenerateRandomCode;
  readonly emailSenderService: EmailSenderService;
  readonly uuidGenerator: IUuidGenerator;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly businessTimeDomainService: BusinessTimeDomainService;
  readonly passwordResetTokenRepository: IPasswordResetTokenRepository;
};

export class RequestPasswordResetUseCase implements IRequestPasswordResetUseCase {
  constructor(private readonly dependencies: Dependencies) { }

  public async execute(dto: RequestPasswordResetDTO): Promise<void> {
    const { email, userType } = dto;

    let userFound: Nullable<AnySystemUserType>;

    switch (userType) {
      case PlayerUserType.value: {
        const playerUserEmail: PlayerUserEmail = PlayerUserEmail.create({ value: email, verified: true });

        userFound = await this.dependencies.playerUserRepository.findByEmail(playerUserEmail);
        break;
      }

      case HostUserType.value: {
        const hostUserEmail: HostUserEmail = HostUserEmail.create({ value: email, verified: true });

        userFound = await this.dependencies.playerUserRepository.findByEmail(hostUserEmail);
        break;
      }

      case RefereeUserType.value: {
        const refereeUserEmail: RefereeUserEmail = RefereeUserEmail.create({ value: email, verified: true });

        userFound = await this.dependencies.playerUserRepository.findByEmail(refereeUserEmail);
        break;
      }

      case LeagueFounderUserType.value: {
        const leagueFounderUserEmail: LeagueFounderUserEmail = LeagueFounderUserEmail.create({ value: email, verified: true });

        userFound = await this.dependencies.playerUserRepository.findByEmail(leagueFounderUserEmail);
        break;
      }

      case TeamFounderUserType.value: {
        const teamFounderUserEmail: TeamFounderUserEmail = TeamFounderUserEmail.create({ value: email, verified: true });

        userFound = await this.dependencies.playerUserRepository.findByEmail(teamFounderUserEmail);
        break;
      }

      default:
        throw InvalidUserTypeError.create(userType);
    }

    if (userFound === null || userFound === undefined) return;

    const verificationCode = this.dependencies.generateRandomCode.generateNumeric(6);
    const expirationDate: DateValueObject = this.dependencies.businessDateDomainService.getCurrentDate();
    const currentTime: TimeValueObject = this.dependencies.businessTimeDomainService.getCurrentTime();
    // Añadir 30 minutos al tiempo actual para la expiración
    const expirationTime: TimeValueObject = this.dependencies.businessTimeDomainService.addMinutes(currentTime, 30);

    const createdAt: DateValueObject = this.dependencies.businessDateDomainService.getCurrentDate();
    const updatedAt: DateValueObject = this.dependencies.businessDateDomainService.getCurrentDate();

    const passwordResetToken = PasswordResetToken.create(
      this.dependencies.uuidGenerator.generate(),
      userFound.id.value,
      userFound.type.value,
      verificationCode,
      expirationDate.value,
      expirationTime.value,
      false,
      createdAt.value,
      updatedAt.value,
    );

    await this.dependencies.passwordResetTokenRepository.save(passwordResetToken);

    const subject = 'Recuperación de contraseña';
    const content = `
      <h1>Recuperación de contraseña</h1>
      <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
      <p>Tu código de verificación es: <strong>${verificationCode}</strong></p>
      <p>Este código expirará en 30 minutos.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    `;

    await this.dependencies.emailSenderService.sendEmail(email, subject, content);
  }
}
