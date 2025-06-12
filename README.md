# @bussin/feature-flag-client

[![NPM Version](https://img.shields.io/npm/v/@bussin/feature-flag-client)](https://npmjs.com/package/@bussin/feature-flag-client) [![NPM Version](https://img.shields.io/npm/dw/@bussin/feature-flag-client)](https://npmjs.com/package/@bussin/feature-flag-client) [![NPM Version](https://img.shields.io/bundlephobia/min/@bussin/feature-flag-client)](https://npmjs.com/package/@bussin/feature-flag-client)

A feature flag client wrapper for LaunchDarkly integration.

License: [MIT](https://opensource.org/licenses/MIT)

## Installation

```bash
    npm install @bussin/feature-flag-client
```

## Quick Start

```TypeScript
import { LaunchDarkly } from '@bussin/feature-flag-client';

const client = LaunchDarkly.getClient('sdk-key');

const isFeatureEnabled = await client.get('is-feature-enabled');
```

## Default Values

The `tryGet` method allows a user-specified default value as a second argument.

```TypeScript
import { LaunchDarkly } from '@bussin/feature-flag-client';

const client = LaunchDarkly.getClient('sdk-key');

const flag = await client.tryGet('feature-key', true);

const user_flag = await client.tryGet('feature-key', true, { kind: 'user', key: '1' });
```

## Context

The last argument of the `get` and `tryGet` methods is an optional context object.

```TypeScript
import { LaunchDarkly } from '@bussin/feature-flag-client';

const client = LaunchDarkly.getClient('sdk-key');

const user_flag = await client.get('feature-key', { kind: 'user', key: '1' });

const user_flag_w_default = await client.tryGet('feature-key', true, { kind: 'user', key: '1' });
```

## Generic Types

Generic types are supported for non-boolean flag values.

```TypeScript
import { LaunchDarkly } from '@bussin/feature-flag-client';

type MyObj = { id: number; values: string[]; };

const client = LaunchDarkly.getClient('sdk-key');

const obj = await client.get<MyObj>('feature-key');

const obj_w_default = await client.tryGet<MyObj>('feature-key', { id: 1, values: [] });
```

## Contributing

To contribute, all PRs should target the `develop` branch. Feature branches must be rebased onto the latest `develop` commit before merging to keep a linear git history.

## Publishing

Package releases are started by manually triggering the [Bump Version](https://github.com/bussin-io/feature-flag-client/actions/workflows/bump-version.yml) GitHub Action. The Bump Version action will create a release commit with the version bump and an associated git tag, and automatically start the [Build and Publish](https://github.com/bussin-io/feature-flag-client/actions/workflows/build-and-publish.yml) GitHub Action. The Build and Publish action requires a manual approval step from a repository admin. Once approved, the package will be published to the NPM registry.

## Support

Please create a PR if you find any missing functionality that you's like to add. For bugs, please use the [issues tracker](https://github.com/bussin-io/feature-flag-client/issues). I'd be happy to help you!
