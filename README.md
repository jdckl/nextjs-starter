# Next.js Starter

Next.js full-stack application - frontend + administration section. Auth ready.

## Getting Started

### 1. Install dependencies

```bash
yarn
```

### 2. Run the development server

```bash
yarn dev
```

### 3. Migrate your DB

This project is using PostgreSQL with Prisma. Migrations, seeding and scheme-updating is done via Prisma.

```bash
yarn db:generate # Generate DB scheme
yarn db:migrate # Migrate DB
yarn db:push # Force push scheme onto DB
```

You can then login with **hello@jdckl.dev:password**.

### 4. Click and type away

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/*`.

## Commit Message Convention

This repo is using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), it is mandatory to use it to commit changes.

## Tests

Project is using Jest for unit testing, with react-testing-library for FE tests and supertest for api tests.

```bash
yarn test
```

## Linting

Linting is done in a pre-commit hook if possible, but feel free to go manual mode. The project uses ESLint and Prettier with some plugins.

```bash
yarn lint
yarn lint:fix
```

**Plugins**  
[Simple Import Sort](https://www.npmjs.com/package/eslint-plugin-simple-import-sort)  
[Unused Imports](https://www.npmjs.com/package/eslint-plugin-unused-imports)  
[Prettier Tailwind](https://www.npmjs.com/package/prettier-plugin-tailwind)
