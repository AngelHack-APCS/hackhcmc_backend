## Presequities 
Before running the application, ensure that you have set up the database. Follow the instructions provided [here](https://github.com/AngelHackAPCS/DB) to install and configure the database.

## How to run with npm

### Installation

```bash
$ npm install
```

### Set up Prisma

```bash
$ npx prisma init
```

Then, go to the `.env` to config the `DATABASE_URL`

```text
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/mydatabase"
```

```bash
$ npx prisma db pull
$ npx prisma generate
```


### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
