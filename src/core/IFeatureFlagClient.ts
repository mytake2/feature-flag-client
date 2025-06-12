import { BaseContext } from './types';

export interface IFeatureFlagClient {
  get<TValue = boolean>(key: string): Promise<TValue>;
  get<TValue = boolean>(key: string, context: BaseContext): Promise<TValue>;
  tryGet<TValue = boolean>(key: string): Promise<TValue | null>;
  tryGet<TValue = boolean>(key: string, defaultValue: TValue): Promise<TValue>;
  tryGet<TValue = boolean>(
    key: string,
    defaultValue: TValue,
    context: BaseContext,
  ): Promise<TValue>;
}
