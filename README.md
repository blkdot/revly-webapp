# Revly Project

## Env variables

We have a file called `.env.example`.

This file is the basic template of our `.env` file.

You still need to create that file.

There we specify the environment variable that should be used.

The `.env.example` file contains the default configuration for the development environment

## Start the project

Use `yarn start` to start the project

## Import forward

Some of our local files are re exported.  
To use them use the following path:

- `kits`: `import {} from 'kits'`
- `contexts`: `import {} from 'contexts'`
- `icons`: `import {} from 'assets/icons'`
- `hooks`: `import {} from 'hooks'`
- `components`: `import {} from 'components'`

## Code formatting

Before every push, run `yarn prettify`

## Error or task waiting to be fixed/done

Search or use this type of comment to notify other coders about things need to be done/fixed `// TODO: xxx`

## credential
email: amine@revly.ae
pwd: @Revly2022

Revly website (prod): app.revly.ae

Revly website (develop): https://webapp-git-develop-revly.vercel.app/dashboard
