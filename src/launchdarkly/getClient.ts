import { BaseContext, IFeatureFlagClient, ILogger } from '@bussin/feature-flag-client/core';
import { LaunchDarklyClient } from './LaunchDarklyClient';

/**
 * Returns a singleton instance of `LaunchDarklyClient` for the given `sdkKey`.
 *
 * @param {string} sdkKey LaunchDarkly sdk key
 * @returns {IFeatureFlagClient} Singleton LaunchDarklyClient instance (singleton by `sdkKey`).
 */
export function getClient<TContext extends BaseContext = BaseContext>(
  sdkKey: string,
  options?: { defaultContext?: TContext; logger?: ILogger },
): IFeatureFlagClient {
  return LaunchDarklyClient.getClient(sdkKey, options);
}
