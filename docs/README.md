# Erela

**Welcome to Erela ツ**

[![npm version](https://badge.fury.io/js/erela.svg)](https://badge.fury.io/js/erela)

Erela is a Nodejs - express - TypeScript starter with simple CLI generator and its built on top of [typeorm](https://typeorm.io/#/) - [routing-controllers](https://github.com/typestack/routing-controllers) - [typedi](https://github.com/typestack/typedi)



## Why? 
 
- To create **very simple and small** API's with orgnized and opinionated code.
- To use the power of decorator and TypeScript from [routing-controllers](https://github.com/typestack/routing-controllers)
- Erela does not force you to use any of the packages it comes with it, nor do stuff in a specific way, you can still use `app.get('/route', fun)..` (express), or just ignore part of it like the entities or don't even use the dependency injection system it comes with, do what ever you want.
- Nothing is linked out of the box (**I recommend that you use the index.ts to export/import stuff to leverage the power of the tsconfig paths aliases**), this is your job which allow you to custmoize anthing, in the way you want to.

I like [Nestjs](https://nestjs.com/), [Feathersjs](https://feathersjs.com/) and [Sailsjs](https://sailsjs.com/) but sometimes they are too much for some of the things I do, so I created erela for myself.


## Quick Start

to install it ([erela on npm](https://www.npmjs.com/package/erela))

```
$ npm i -g erela
$ erela
```
this will print the following list for you

<img src="https://raw.githubusercontent.com/MohammedAl-Rowad/Erela/master/docs/imgs/erela-quick-start.png">

Select genrating an APP then type the path with the name for it, erela cli now will generate the following application


<details>
  <summary>Click to see the application folders/files</summary>
  
  
```
.
├── README.md
├── dist
│   ├── erela.cli.js
│   └── src
│       ├── app.js
│       ├── controllers
│       │   └── index.js
│       ├── entities
│       │   ├── index.js
│       │   └── users.entity.js
│       ├── interfaces
│       │   └── index.js
│       ├── services
│       │   └── index.js
│       └── types
│           ├── generic.types.js
│           └── index.js
├── erela.cli.js
├── erela.cli.ts
├── package.json
├── src
│   ├── app.ts
│   ├── controllers
│   │   └── index.ts
│   ├── entities
│   │   ├── index.ts
│   │   ├── migrations
│   │   └── users.entity.ts
│   ├── interfaces
│   │   └── index.ts
│   ├── services
│   │   └── index.ts
│   ├── subscribers
│   └── types
│       ├── generic.types.ts
│       └── index.ts
├── tsconfig.json
└── tslint.json
```
</details>

feel free the explore the code or continue reading the docs


# Running the application

After you generated an app, you need to 

- `npm install`
- `npm run dev` 

`npm run dev` will serve the application on the port defined by the variable `APP_PORT` from the `.env` file 


> Erela comes with `.env.example` file that you should rename to `.env`, AND PLEASE ADD THIS FILE YOU YOUR `.gitignore`


# Compiling the application

Run `npm run build` and that will put the compiled JS code into a folder called `dist` ( and you can change that in `tsconfig.json`)

# Main Components

The idea behind erela is to have a `controller` - `service` - `entity` for each part of you application, ofcourse you don't need 
all this sometime, everything is up to you!

the below sections will explain these 3 components and mention others

## Controllers

controllers are just a class decorated with the [routing-controllers](https://github.com/typestack/routing-controllers) decorators, and I'll show you a basic controller that erela generates

```js
import {
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  JsonController,
} from 'routing-controllers'
import { DeepPartial } from 'utility-types'

@JsonController('/users')
export class UsersContoller {
  constructor() {}

  @Get()
  async getAll(): Promise<void> {}

  @Get('/:id')
  async getOne(): Promise<void> {}

  @Post()
  async post(@Body() body: DeepPartial<any>): Promise<void> {}

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() body: any): Promise<void> {}

  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<void> {}
}

```

and as you can see each function will map to a specific HTTP method, and the routes for this controller are

- `/users`       `[GET]`
- `/users/:id`   `[GET]`
- `/users`       `[POST]`
- `/users/:id`   `[PATCH]`
- `/users/:id`   `[DELETE]`


Read more in [routing-controllers](https://github.com/typestack/routing-controllers), everything you can do with it is available here.


> So, in general a controller should just act as a pipe line for the request, so after a request reached any controller method you need to might want to call a service methods (but still everything is up to you).

### Generating a controller


```
$ erela # make sure you are in an erela project
```

<img src="https://raw.githubusercontent.com/MohammedAl-Rowad/Erela/master/docs/imgs/gen-controller.gif" width="100%">


## Services

A service is a class that can be added to the dependency injection framework that is provided via [typedi](https://github.com/typestack/typedi), and the main purpose of a service is to do the logic to handle the request, that might be calling methods from entites to contact the database, or write on the file system or contact another API and so on.

Erela can generates 2 types of services

- `Base`
- `Custom`

### Base service

to generate a base service

<img src="https://raw.githubusercontent.com/MohammedAl-Rowad/Erela/master/docs/imgs/gen-base-service.gif" width="100%">


```js
import { Repository, DeepPartial, ObjectLiteral } from 'typeorm'

// TODO:: extend me!
export class BaseService<T> {
  public readonly repo: Repository<T>

  constructor(repo: Repository<T>) {
    this.repo = repo
  }

  async getData(): Promise<Array<T>> {
    return await this.repo.find()
  }

  async getById(id: number, where?: ObjectLiteral): Promise<T> {
    if (where) {
      return await this.repo.findOneOrFail(id, { where })
    } else {
      return await this.repo.findOneOrFail(id)
    }
  }

  async create(
    data: DeepPartial<T>,
    entityAlreadyCreated?: DeepPartial<T>
  ): Promise<T> {
    const entity: DeepPartial<T> =
      entityAlreadyCreated || this.getInstance(data)
    return await this.repo.save(entity)
  }

  getInstance(data: DeepPartial<T>): DeepPartial<T> {
    return this.repo.create(data)
  }

  async update(id: number, body: DeepPartial<T>): Promise<T> {
    await this.repo.update(id, body)
    return this.getById(id)
  }

  async del(id: number): Promise<T> {
    const entity = await this.getById(id)
    await this.repo.delete(id)
    return entity
  }
}
```

and as you can see the base service is just a generic class that accepts a type, which is the entity you will pass to it, and the base service it just a fast way to write CRUD operations on an entity.


### Custom service

To generate a custom service

<img src="https://raw.githubusercontent.com/MohammedAl-Rowad/Erela/master/docs/imgs/gen-custom-service.gif" width="100%">


```js
import 'reflect-metadata'
import { Service } from 'typedi'
import { Connection } from 'typeorm'

// If this extended the Base service which you can generate
// just call the super constructor and pass a typeorm repo to it
// then you have a basic curd
@Service()
export class UsersService  {
  constructor(db: Connection) {
    // super(db.getRepository(UsersEntity))
  }
}
```

this is the boilerplate that gets generated but you are free to do whatever you want with it.


## Database

Erela uses entities to model the database and these are just the TypeORM entities, nothing more, you can generate one the same way we generated a service or a controller.

> if you are planning to use a database, you should know that Erela comes with TypeORM - TypeORM cli - TypeORM migrations integrated out of the box! ( more on this in the next section ).

You should read about [TypeORM](https://typeorm.io/#/).

### TypeORM Integration

You can use the TypeORM cli out of the box in an Erela app to do the following things

- `npm run typeorm ( just to use the typeorm cli to do anything you want use -- to pass args to it )`
- `npm run typeorm:migrate ( to generate migrations )`
- `npm run typeorm:run ( to run the migrations )`
- `npm run create:entity ( to create an entity using TypeORM cli )`
- `npm run create:sub ( to create a subscription using TypeORM cli )`


#### Migrations

After you used `erela` cli or `npm run create:entity` and generated your entities, you can run `npm run typeorm:migrate name_of_the_migration` to generate a migration with the changes you made to the entities.

And to run these migrations you just have to run `npm run typeorm:run`

read more
- [TypeORM](https://typeorm.io/)
- [Entities](https://typeorm.io/#/entities)
- [Migrations](https://typeorm.io/#/migrations)
- [Listeners & Subscribers](https://typeorm.io/#/listeners-and-subscribers)


#### DB Connections & Drivers

The logic that connects with the DB is in `src/entities/index.ts` it's all exposed so you can configure it as you wish, but things to remember

> you need to install a driver if you want to connect with mysql for example , you'll install the mysql driver for node `npm install mysql -S` 

read more [here](https://typeorm.io/#/undefined/installation)

> TypeORM in erela is configured via `.env` file 

read more [here](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md#using-environment-variables)

> by default the app won't try to connect to any db, you need to change a variable called `CONNECT_WITH_DB` in the `.env` file to true

## .ENV (environment variables)

erela comes with a file called `.env.example`, you should rename this to `.env` so the app can read from it, and inside of it is just base stuff that we usually put there plus the typeorm [configs](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md#using-environment-variables)

```.env
DB_HOST=127.0.0.1
DB_USER=user
DB_PASS=secret
CONNECT_WITH_DB=false

APP_PORT=3030
EXT=ts

TYPEORM_CONNECTION = sqlite
TYPEORM_HOST = localhost
TYPEORM_USERNAME = root
TYPEORM_PASSWORD = secret
TYPEORM_DATABASE = Elera.db
TYPEORM_SYNCHRONIZE = false
TYPEORM_LOGGING = true
TYPEORM_ENTITIES = ./src/entities/*.ts
TYPEORM_ENTITIES_DIR = ./src/entities
TYPEORM_SUBSCRIBERS=./src/subscribers/*.ts
TYPEORM_SUBSCRIBERS_DIR=./src/subscribers
TYPEORM_MIGRATIONS = ./src/entities/migrations/*.ts
TYPEORM_MIGRATIONS_DIR = ./src/entities/migrations


JWT_SECRET=secret
```



## Authentication

Erela uses [routing-controllers](https://github.com/typestack/routing-controllers) and supports only  bearer authentication ([JWT](https://jwt.io/)) out of the box, you authenticate a request the only thing you need to do is the following

```js
import {
  Param,
  Body,
  Get,
  Post,
  Delete,
  Patch,
  JsonController,
  Authorized,
  CurrentUser,
} from 'routing-controllers'
import { DeepPartial } from 'utility-types'

@JsonController('/users')
@Authorized() // to guard all the routes in this controller
export class UsersContoller {
  constructor() {}
  
  // @CurrentUser to get the user that sent the request
  @Get()
  getData(@CurrentUser() user: any) {

  }

  @Post()
  @Authorized() // or only on a single route
  create(@Body() body: any) {

  }
}
```


the logic for the authentication comes from `authorizationChecker` & `currentUserChecker` functions in `src/app.ts`, which uses by default the users entity which comes with erela by default (feel free to change that).





## Extras

[CRUD video](https://www.youtube.com/watch?v=ZONommzfUk8) showing me creating 

- CRUD enpoints
- Users Service
- Users Entity

[migration video](https://www.youtube.com/watch?v=NKZXkgA2LAc)


> Created by [rowadz](https://github.com/MohammedAl-Rowad)