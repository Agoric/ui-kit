# Maintainer Hints

### Prerequisites

#### Build Environment

Follow the instructions at the [getting started
guide](https://docs.agoric.com/guides/getting-started/) to install
the correct versions of `node`, `yarn`, and `git`. Also install the
latest version of the [Go development tools](https://go.dev/doc/install).

#### NPM Account

Sign up for an [NPM account](https://www.npmjs.com/signup) with
some form of 2FA. Then request that an administrator add your NPM
user ID to the `@agoric` organization and the `agoric` package.

### Generating the Release

- [ ] Bump release versions and update CHANGELOG.md

Use `--conventional-prerelease` instead of `--conventional-commits` if you just want to generate a dev release.

```sh
# Create the final release CHANGELOGs.
yarn lerna version --no-push --conventional-commits
# look it over before pushing
git push
```


- [ ] Create the release PR.

Push a PR that bumps the package number per semver. Have a separate commit for each pacakge.
For example, `chore(release): publish _release_label_`.

Creating this PR will also kick off the CI tests.

- [ ] Build the NPM-installed SDK packages.

While the above CI tests run, verify that packaging will work:

```sh
# Build all package generated files.
yarn install --force
yarn workspaces run prepack
```

- [ ] Wait for the release PR's CI tests to pass.

### Publish the Release

These steps cannot be undone, so be sure that you are ready to proceed.
In particular, be sure that you have waited for the release PR's CI tests
to pass.

If you get E404, you're probably not logged in. Your .npmrc should have a line like,
```
//registry.npmjs.org/:_authToken=npm_randomstring
```
If it doesn't, use `npm login` to authenticate before running publish.

- [ ] Publish to NPM

```sh
# Publish to NPM.
# https://lerna.js.org/docs/features/version-and-publish#from-package
yarn lerna publish from-package
```
