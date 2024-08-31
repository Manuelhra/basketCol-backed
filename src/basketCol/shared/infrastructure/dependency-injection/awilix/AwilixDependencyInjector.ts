import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  Constructor,
  createContainer,
  FunctionReturning,
  NameAndRegistrationPair,
  Resolver,
} from 'awilix';

import { IDependencyInjector } from '../IDependencyInjector';

export abstract class AwilixDependencyInjector<TContainer extends Object> implements IDependencyInjector<AwilixContainer<TContainer>, NameAndRegistrationPair<TContainer>> {
  public container: AwilixContainer<TContainer> | null = null;

  public createContainer(): void {
    this.container = createContainer<TContainer>();
  }

  public getContainer(): AwilixContainer<TContainer> | null {
    return this.container;
  }

  public registerDependencies(dependencies: NameAndRegistrationPair<TContainer>): void {
    if (this.container !== null) {
      this.container.register(dependencies);
    }
  }

  public static registerAsValue<T>(value: T): Resolver<T> {
    return asValue(value);
  }

  public static registerAsFunction<T>(fn: FunctionReturning<T>) {
    return asFunction(fn);
  }

  public static registerAsClass<T>(cls: Constructor<T>) {
    return asClass(cls);
  }
}
