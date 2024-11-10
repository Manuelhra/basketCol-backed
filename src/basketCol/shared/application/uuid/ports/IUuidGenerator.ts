export interface IUuidGenerator {
  generate(): string;
  validate(uuid: string): boolean;
  version(): number;
}
