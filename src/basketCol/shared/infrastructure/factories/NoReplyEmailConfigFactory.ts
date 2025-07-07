//  TODO: Pasar a variables de entorno
export abstract class NoReplyEmailConfigFactory {
  public static createNoReplyEmailConfig() {
    return {
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: 'noreply@basketcol.com',
        pass: 'vrMr6sTdqqsJ',
      },
    };
  }
}
