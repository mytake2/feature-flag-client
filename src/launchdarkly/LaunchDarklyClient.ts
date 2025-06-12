import { init } from '@launchdarkly/node-server-sdk';
import { LDClient } from '@launchdarkly/js-server-sdk-common';
import {
  BaseContext,
  FeatureFlagClientGetError,
  IFeatureFlagClient,
  ILogger,
} from '@mytake2/feature-flag-client/core';

export class LaunchDarklyClient implements IFeatureFlagClient {
  public static readonly Anonymous: BaseContext = {
    kind: 'anonymous',
    key: 'anonymous',
    anonymous: true,
  };
  private static readonly DefaultFlagValue: symbol = Symbol('DEFAULT_LAUNCH_DARKLY_FLAG_VALUE');
  private static readonly Clients: Record<string, LaunchDarklyClient> = {};

  /**
   * Returns a singleton instance of `LaunchDarklyClient` for the given `sdkKey`.
   *
   * @param {string} sdkKey LaunchDarkly sdk key
   * @returns {IFeatureFlagClient} Singleton LaunchDarklyClient instance (singleton by `sdkKey`).
   */
  public static getClient(
    sdkKey: string,
    options?: {
      defaultContext?: BaseContext;
      logger?: ILogger;
    },
  ): LaunchDarklyClient {
    if (!LaunchDarklyClient.Clients[sdkKey]) {
      LaunchDarklyClient.Clients[sdkKey] = new LaunchDarklyClient(
        sdkKey,
        options?.defaultContext ?? LaunchDarklyClient.Anonymous,
        options?.logger ?? console,
      );
    }

    return LaunchDarklyClient.Clients[sdkKey];
  }

  public readonly defaultContext: BaseContext;
  private readonly _clientPromise: Promise<LDClient>;

  private constructor(sdkKey: string, defaultContext: BaseContext, logger: ILogger) {
    // Do not await initialization, this will be done later when the client is used.
    this._clientPromise = init(sdkKey, { logger }).waitForInitialization({ timeout: 30 });
    this.defaultContext = defaultContext;
  }

  public async get<TValue = boolean>(key: string): Promise<TValue>;
  public async get<TValue = boolean>(key: string, context: BaseContext): Promise<TValue>;
  public async get<TValue = boolean>(key: string, context?: BaseContext): Promise<TValue> {
    context ??= this.defaultContext;

    const value = await this._get<TValue>(key, context);

    if (value === LaunchDarklyClient.DefaultFlagValue)
      throw new FeatureFlagClientGetError(key, context);

    return value;
  }

  public async tryGet<TValue = boolean>(key: string): Promise<TValue | null>;
  public async tryGet<TValue = boolean>(key: string, defaultValue: TValue): Promise<TValue>;
  public async tryGet<TValue = boolean>(
    key: string,
    defaultValue: TValue,
    context: BaseContext,
  ): Promise<TValue>;
  public async tryGet<TValue = boolean>(
    key: string,
    defaultValue?: TValue,
    context?: BaseContext,
  ): Promise<TValue | null> {
    context ??= this.defaultContext;

    const value = await this._get<TValue>(key, context!);

    if (value === LaunchDarklyClient.DefaultFlagValue) {
      if (arguments.length >= 2) {
        // Caller provided a defaultValue (which might itself be null/undefined)
        return defaultValue as TValue;
      } else {
        // No defaultValue was passed: return null
        return null;
      }
    }

    return value;
  }

  private async _get<TValue>(key: string, context: BaseContext): Promise<TValue> {
    // Although it looks like we are initializing the client multiple times, we are not:
    // A Promise object in NodeJS maintains an internal state. The Promise starts in "pending",
    // then transitions to either "fulfilled" or "rejected" once the value is computed. After it
    // is computed/settled, every subsequent await (or .then) returns the same computed value -
    // nothing is re‐executed internally.
    const client = await this._clientPromise;

    return await client.variation(key, context, LaunchDarklyClient.DefaultFlagValue);
  }
}
