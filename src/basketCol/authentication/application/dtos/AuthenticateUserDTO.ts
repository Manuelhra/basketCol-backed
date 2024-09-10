export interface AuthenticateUserDTO {
  nickname?: string;
  email?: string;
  password: string;
  type: string;
}

// TODO: Crear value object de username para los usuarios
