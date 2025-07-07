export class GenerateRandomCode {
  public generate(
    length: number = 8,
    includeUppercase: boolean = true,
    includeLowercase: boolean = true,
    includeNumbers: boolean = true,
    includeSpecial: boolean = false,
  ): string {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    let charset = '';
    if (includeUppercase) charset += uppercaseChars;
    if (includeLowercase) charset += lowercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSpecial) charset += specialChars;

    if (charset.length === 0) {
      throw new Error('Debe habilitar al menos un conjunto de caracteres para generar el código');
    }

    let result = '';
    for (let i = 0; i < length; i += 1) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }

    return result;
  }

  public generateNumeric(length: number = 6): string {
    return this.generate(length, false, false, true, false);
  }

  public generateWithFormat(
    format: string,
    includeUppercase: boolean = true,
    includeLowercase: boolean = true,
    includeNumbers: boolean = true,
  ): string {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';

    if (charset.length === 0) {
      throw new Error('Debe habilitar al menos un conjunto de caracteres para generar el código');
    }

    let result = '';
    for (let i = 0; i < format.length; i += 1) {
      if (format[i] === 'X') {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
      } else {
        result += format[i];
      }
    }

    return result;
  }
}
