# Deployer Action


![Version](https://img.shields.io/github/package-json/v/ActiveEngagement/deployer-action?sort=semver)

This GitHub action will package artifacts for [deployer](https://github.com/ActiveEngagement/deployer) and upload them via SSH to your server.

## Quick Start

If you've used this action before, quickly set up deployer-action on a new project with one of the following templates for staging and production. If you're not familiar with this action, [read on](#introduction).

### Staging

If you've not already done so, generate an SSH key pair (`ssh-keygen` on Ubuntu). Add the generated public key to your server's `authorized_keys` (this can be done from the SSH Keys page of the Laravel Forge interface). Create a GitHub Actions secret in your repository called `STAGING_KEY` containing the generated private key.

Now copy your Forge [Deployment Trigger URL](https://forge.laravel.com/docs/1.0/sites/deployments.html#using-deployment-triggers) into a GitHub Actions secret called `STAGING_DEPLOY_URL`.

Finally, add the template below to your workflow file (in `.github/workflows`). Replace `111.222.333.444` with the public IP address of your server (this must be the server itself, not any intervening proxies like CloudFlare). Replace `example.com` with the name of your Forge site (which, of course, is your domain name). Adjust the `artifacts` input to match your [deployer artifact rules](https://github.com/ActiveEngagement/deployer#artifacts).

```yaml
    - uses: ActiveEngagement/deployer-action@v0.2
      with:
        ssh_host: forge@111.222.333.444 # Server host. Substitute IP.
        ssh_key: ${{ secrets.STAGING_KEY }}
        destination: example.com/storage/deployer/artifact_bundles/ # Destination on server. Substitute site name.
        artifacts: '{ "build": "public/build" }' # Adjust as required.
        deploy_url: ${{ secrets.STAGING_DEPLOY_URL }}
        env: staging
```

### Production

If you've not already done so, generate an SSH key pair (`ssh-keygen` on Ubuntu). Add the generated public key to your server's `authorized_keys` (this can be done from the SSH Keys page of the Laravel Forge interface). Create a GitHub Actions secret in your repository called `PROD_KEY` containing the generated private key.

Now copy your Forge [Deployment Trigger URL](https://forge.laravel.com/docs/1.0/sites/deployments.html#using-deployment-triggers) into a GitHub Actions secret called `PROD_DEPLOY_URL`.

Finally, add the template below to your workflow file (in `.github/workflows`). Replace `111.222.333.444` with the public IP address of your server (this must be the server itself, not any intervening proxies like CloudFlare). Replace `example.com` with the name of your Forge site (which, of course, is your domain name). Adjust the `artifacts` input to match your [deployer artifact rules](https://github.com/ActiveEngagement/deployer#artifacts).

```yaml
    - uses: ActiveEngagement/deployer-action@v0.2
      with:
        ssh_host: forge@111.222.333.444 # Server host. Substitute IP.
        ssh_key: ${{ secrets.PROD_KEY }}
        destination: example.com/storage/deployer/artifact_bundles/ # Destination on server. Substitute site name.
        artifacts: '{ "build": "public/build" }' # Adjust as required.
        deploy_url: ${{ secrets.PROD_DEPLOY_URL }}
        env: production
        version: ${{ github.ref_name }}
```

## Introduction

deployer is a simple Laravel package that deploys "artifact bundles" from a directory on the server to the Laravel app. These bundles are simply directories containing a manifest file with metadata such as the `bundled_at` timestamp.

This GitHub action will take artifacts, package them into a deployer bundle, and upload them via SSH to a directory on your server so that deployer can then deploy them to the app.

For example, in the common use case of frontend asset building, the flow looks like this:

1. Your workflow outputs built assets to a directory, "public/build" for example.
2. deployer-action takes that directory (and other artifacts, if desired) and packages them into a deployer bundle.
3. deployer-action uploads the bundle to the directory on your server that deployer is [configured to look in](https://github.com/ActiveEngagement/deployer#configuration); a typical example with Forge would be "example.com/storage/deployer/artifact_bundles".
4. deployer-action triggers your [deployment URL](https://github.com/ActiveEngagement/deployer#configuration), starting a Forge deployment.
5. Your Forge deploy script executes a command like `php artisan deployer --latest`, which moves the newly uploaded artifact from the bundle to the "public/build" directory in your app.

## Before You Start

Since deployer-action operates over SSH, the first step is generating an SSH key pair. On Ubuntu, this can be done with `ssh-keygen`. Then, you'll need to authorize the key pair on your server by adding the public key (the generated file ending with `.pub`) to your `authorized_keys` file. In Laravel Forge, this can be done easily from the SSH Keys page. Finally, make the private key (the generated file with no extension) available to the action by adding it as a GitHub Actions secret.

If security is an issue, you may wish to restrict the abilities of the SSH key. In that case, do note that deployer-action must be able to:
* execute an `scp` command to create a subdirectory in the [destination directory](#destination);
* execute a `mkdir -p` command for the destination directory, to ensure its existence.

## Usage

```yaml
    - uses: ActiveEngagement/deployer-action@v0.2
      with:
        # REQUIRED
        ssh_host:
        ssh_key:
        destination:
        artifacts:
        # OPTIONAL
        deploy_url:
        env:
        version:
```

### `ssh_host`

REQUIRED. The SSH host, in the format `{user}@{ip|domain}`.

We recommend avoiding domain names if possible, since they often resolve to proxies (e.g. CloudFlare) instead of the server itself.

If using Laravel Forge, `{user}` will likely be `forge` and `{ip}` will be the "Public IP" shown on the server dashboard.

### `ssh_key`

REQUIRED. The private SSH key

We will save this key to a protected `id_rsa` file on disk and use it in the `scp` command to upload bundles to your server. Before the action exits, this file will be destroyed for security reasons.

Since this is a highly sensitive value, you should store it in an Actions secret and pass it to deployer-action.

### `destination`

REQUIRED. The path to the directory on the server to which to upload bundles.

This is the file path to the directory on the server where bundles should be uploaded. This path will be passed directly to `scp`.

In a typical deployer setup, you will want to deploy bundles to the "storage/deployer/artifact_bundles" directory of your app. With Forge, your app resides in a subdirectory under the home directory with the same name as the site, whose name is its domain name. Thus, the destination would look like "example.com/storage/deployer/artifact_bundles".

A `mkdir -p {destination}` command will be executed before bundles are uploaded to ensure that the destination directory exists.

### `artifacts`

REQUIRED. The artifact rules.

This input must be a string containing a JSON object of artifact rules. These rules are defined similarly to [deployer artifact rules](https://github.com/ActiveEngagement/deployer#artifacts). Each key is the file name the artifact should have in the bundle, and each value is the file path to the original artifact.

For example, in a typical asset-building scenario, assets might be output to "public/build/*". In that case, an `artifacts` input of `{ "assets": "public/build" }` would create an "assets" artifact in the bundle containing the "public/build" directory. Then, deployer can be configured to deploy the "assets" artifact from the bundle.

Also note that this key must be a YAML string. Since YAML supports a JSON-like format for maps and lists, you must either quote the input:

```yaml
          artifacts: '{ "one": "path/to/file.md", "two": "path/to/file2.md" }'
```

or make use of YAML multiline strings:

```yaml
          artifacts: |
            {
              "one": "path/to/file.md",
              "two": "path/to/file2.md"
            }
```

The following will **NOT** work:

```yaml
          artifacts: { "one": "path/to/file.md", "two": "path/to/file2.md" } # FAILS, since YAML interprets this is a map.
```

### `deploy_url`

OPTIONAL. Your Forge Deployment Trigger URL.

As a convenience, we provide the ability to hit your Forge [Deployment Trigger URL](https://forge.laravel.com/docs/1.0/sites/deployments.html#using-deployment-triggers) after the bundle upload is complete. This saves you the extra step in your workflow.

If this input is given, a GET request will be made to the URL. The response will be ignored.

Since this URL is sensitive, you will likely wish to keep it in an Actions secret and pass it to deployer-action.

### `env`

OPTIONAL. The environment being deployed to.

This is a string representing the environment being deployed to. It is solely for organizational purposes and will be included in the bundle metadata. Throughout this document, we use the environments `"production"` and `"staging"`, but you are free to use whatever you wish.

### `version`

OPTIONAL. The version with which to associate the bundle.

This is a string representing the "version" for which the bundle was created. It is solely for organizational purposes and will be included in the bundle metadata. Throughout this document, we tend to use application versions and Semver, but you are free to use any string and any meaning of the word "version".