import { v4 as uuidV4, validate } from 'uuid';

import { IUuidGenerator } from '../../application/uuid/ports/IUuidGenerator';

export class UuidV4Generator implements IUuidGenerator {
  public static create(): UuidV4Generator {
    return new UuidV4Generator();
  }

  generate(): string {
    return uuidV4();
  }

  validate(uuid: string): boolean {
    return validate(uuid);
  }

  version(): number {
    return 4; // UUIDv4
  }
}
