import { LaunchDarkly } from '@bussin/feature-flag-client';

const run = async () => {
  try {
    const client = LaunchDarkly.getClient('sdk-1234');
    const featureKey = 'is-feature-enabled';

    // no context / default context
    const isEnabled = await client.get(featureKey);
    console.log(isEnabled);

    // with context
    const context = { kind: 'user', key: '123', email: 'email@example.com' };
    const isEnabledForUser = await client.get(featureKey, context);
    console.log(isEnabledForUser);

    console.log('done');
  } catch (error) {
    console.log(error);
  }
};

run();
