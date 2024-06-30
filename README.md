AngelHack Hackhcmc - Team AIO_APCS1 Backend Repo

## Introduction 

This repository contains the backend code for our hackhcmc 2024 project.

## Link to components

### Frontend
You can access our frontend server [here](https://github.com/AngelHack-APCS/hackhcmc_frontend)

### Database
You can access our database server [here](https://github.com/AngelHack-APCS/hackhcmc_db)

### AI
You can access our AI service [here](https://github.com/AngelHack-APCS/hackhcmc_ai)

## Presequities 
Before running the application, ensure that you have set up the database. Follow the instructions provided [here](https://github.com/AngelHack-APCS/hackhcmc_db) to install and configure the database.

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

## Contributors:

- [qvanle](https://github.com/qvanle)
- [BachNgoH](https://github.com/BachNgoH)
- [DiriiMQ](https://github.com/DiriiMQ)
- [dphu2609](https://github.com/dphu2609)

## License

Nest is [MIT licensed](LICENSE).
