import {
  IPasswordResetTokenPrimitives,
  IPasswordResetTokenRepository,
  Nullable,
  PasswordResetToken,
  PasswordResetTokenCode,
  PasswordResetTokenId,
  PasswordResetTokenUserId,
} from '@basketcol/domain';

import { MongooseRepository } from '../../../../shared/infrastructure/persistence/mongoose/MongooseRepository';
import { IMongoosePasswordResetTokenDocument } from './IMongoosePasswordResetTokenDocument';

export class MongoosePasswordResetTokenRepository
  extends MongooseRepository<IPasswordResetTokenPrimitives, PasswordResetToken>
  implements IPasswordResetTokenRepository {
  protected collectionName(): string {
    return 'password_reset_token';
  }

  public async findByCodeAndUserId(passwordResetTokenCode: PasswordResetTokenCode, passwordResetTokenUserId: PasswordResetTokenUserId): Promise<Nullable<PasswordResetToken>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePasswordResetTokenDocument> = await MyModel.findOne<IMongoosePasswordResetTokenDocument>({ code: passwordResetTokenCode.value, userId: passwordResetTokenUserId.value });
    return document === null ? null : this.#mapDocumentToPasswordResetToken(document);
  }

  public async findByCode(passwordResetTokenCode: PasswordResetTokenCode): Promise<Nullable<PasswordResetToken>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePasswordResetTokenDocument> = await MyModel.findOne<IMongoosePasswordResetTokenDocument>({ code: passwordResetTokenCode.value });
    return document === null ? null : this.#mapDocumentToPasswordResetToken(document);
  }

  public async findById(passwordResetTokenId: PasswordResetTokenId): Promise<Nullable<PasswordResetToken>> {
    const MyModel = await this.model();
    const document: Nullable<IMongoosePasswordResetTokenDocument> = await MyModel.findOne<IMongoosePasswordResetTokenDocument>({ id: passwordResetTokenId.value });
    return document === null ? null : this.#mapDocumentToPasswordResetToken(document);
  }

  public save(passwordResetToken: PasswordResetToken): Promise<void> {
    return this.persist(passwordResetToken);
  }

  #mapDocumentToPasswordResetToken(document: IPasswordResetTokenPrimitives): PasswordResetToken {
    return PasswordResetToken.fromPrimitives(
      document.id.valueOf(),
      document.userId.valueOf(),
      document.userType.valueOf(),
      document.code.valueOf(),
      document.expiresAtDate.valueOf(),
      document.expiresAtTime.valueOf(),
      document.isUsed.valueOf(),
      document.createdAt.valueOf(),
      document.updatedAt.valueOf(),
    );
  }
}
