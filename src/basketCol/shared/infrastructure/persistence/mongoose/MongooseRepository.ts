import { AggregateRoot, IAggregateRoot } from '@basketcol/domain';
import { Model, Mongoose, Schema } from 'mongoose';

export abstract class MongooseRepository<IAggregate extends IAggregateRoot, TAggregate extends AggregateRoot<IAggregate>> {
  readonly #client: Promise<Mongoose>;

  readonly #schema: Schema<IAggregate>;

  constructor(dependencies: {
    mongooseClient: Promise<Mongoose>;
    mongooseSchema: Schema<IAggregate>;
  }) {
    this.#client = dependencies.mongooseClient;
    this.#schema = dependencies.mongooseSchema;
  }

  protected abstract collectionName(): string;

  protected async persist(aggregate: TAggregate): Promise<void> {
    const MyModel:Model<{ [key: string]: any }> = await this.model();
    const { id, ...props } = aggregate.toPrimitives();

    await MyModel.updateOne({ id }, { ...props }, { upsert: true });
  }

  protected async model(): Promise<Model<{ [key: string]: any }>> {
    return (await this.#client).model(this.collectionName(), this.#schema);
  }
}
