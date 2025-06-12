import { BaseContext } from '../types';
import { FeatureFlagClientBaseError } from './FeatureFlagClientBaseError';

export class FeatureFlagClientGetError<
  TContext extends BaseContext = BaseContext,
> extends FeatureFlagClientBaseError {
  constructor(
    public readonly flagName: string,
    public readonly context: TContext,
  ) {
    super(`Unable to get value for flag '${flagName}'.`);
    this.name = 'FeatureFlagClientGetError';
  }
}
