import { RootError } from '@basketcol/domain';

export class DependencyContainerNotInitializedError extends RootError {
  private constructor() {
    const message = 'Dependency container has not been initialized.';
    super(message);
    this.name = 'DependencyContainerNotInitializedError';
  }

  public static create(): DependencyContainerNotInitializedError {
    return new DependencyContainerNotInitializedError();
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
