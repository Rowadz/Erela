# Erela

**Welcome to Erela ツ**

Erela is a Nodejs - express - TypeScript starter with simple cli generator.
- `npm run erela` to generate stuff
- built on top of [typeorm](https://typeorm.io/#/) - [routing-controllers](https://github.com/typestack/routing-controllers) - [typedi](https://github.com/typestack/typedi)



Why Erela? 
 
- To create **very simple and small** API's with orgnized code
- To use the power of decorator and TypeScript from [routing-controllers](https://github.com/typestack/routing-controllers)
- **Erela dose not force you to use any of the packages it comes with it nor do stuff in a specific way, you can still use `app.get('/route', fun)..` (express), or just ignore part of it like the entites or don't event use the dependency injection system it comes with, do what ever you want**
- nothing is linked out of the box (**I recommend that you use the index.ts to export/import stuff to leverage the power of the tsconfig paths aliases**), this is your job which allow you to custmoize anthing.

I like [Nestjs](https://nestjs.com/), [Feathersjs](https://feathersjs.com/) and [Sailsjs](https://sailsjs.com/) but sometimes they are too much for some of the things I do, so I created erela for myself.


## How to use 

- to install

```bash
$ git clone https://github.com/MohammedAl-Rowad/Erela.git
$ cd Erela
$ npm install
```

- to run dev server  

```bash
$ npm run dev
```

- to compile to js

```bash
$ npm run build
```
note after you compile the js code will be inside a folder called `dist` in the root of your app, and you need to do this to make it work ( go to the package.json and change the path for the `_moduleAliases`)
```json
{
  "_moduleAliases": {
    "@types": "dist/src/types",
    "@controllers": "dist/src/controllers",
    "@entities": "dist/src/entities",
    "@interfaces": "dist/src/interfaces",
    "@services": "dist/src/services"
  },
}
```


## Folder Structure & Concepts

```
│── src
│   ├── app.ts
│   ├── controllers
│   │   └── index.ts
│   ├── entities
│   │   ├── index.ts
│   │   └── migrations
│   ├── interfaces
│   │   └── index.ts
│   ├── services
│   │   └── index.ts
│   └── types
│       ├── generic.types.ts
│       └── index.ts
├── templates
│   ├── controller.template.txt
│   ├── entity.template.txt
│   ├── service.base.template.txt
│   └── service.template.txt
├── tsconfig.json
├── README.md
├── erela.cli.ts
├── package-lock.json
├── package.json
└── tslint.json
```

### About Controllers
In Erela Controllers will look something like this 

<details>
  <summary>Click to see controller example</summary>
  
  ## Heading
  ```ts
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
import { UsersService } from '@services' 

@JsonController('/users')
export class UsersContoller {
  constructor(private readonly usersService: UsersService) {}

  // to get all data with pagination
  @Get()
  async getAll(): Promise<void> {}

  @Get('/:id')
  async getOne(): Promise<void> {}

  @Post()
  async post(@Body() user: DeepPartial<any>): Promise<void> {}

  @Patch('/:id')
  async patch(@Param('id') id: number, @Body() user: any): Promise<void> {}

  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<void> {}
}

  ```
</details>


This controller is generated when you run 

```bash
$ npm run erela
$ # now select controller and enter its name
```
**Erela dose not introducre new stuff** so controllers are based on this package [routing-controllers](https://github.com/typestack/routing-controllers) and for the dependency injection erela comes with [typedi](https://github.com/typestack/typedi) which you can configure in `src/app.ts` so you can inject services.




### About Services


Erela can generates 2 types of services:
- empty
- base

empty services are just classes that are decorated with the `@Service()` decorator for typedi


<details>
  <summary>Click to see empty service that extends a base service</summary>
  
  ```ts
  // this service can do all the CRUD operations on the UsersEntity
  import 'reflect-metadata'
import { Service } from 'typedi'
import { Connection } from 'typeorm'
import { UsersEntity } from '@entities'
@Service()
export class usersService  {
  constructor(db: Connection) {
    super(db.getRepository(UsersEntity))
  }
}
  ```
</details>


base services are just a CRUD class using TypeORM, you need to extend this class by empty services and base the entity to it in the super function, go here to see the base service `templates/service.base.template.txt`


### About Entites

They are just [TypeORM](https://typeorm.io/) entites, please read their documentation

However, Erela comes configured with TypeORM cli so you can use it without intalling it globally.

#### Generating Migrations

- to generate a migration just type in your terminal 

```bash 
$ npm run typeorm:migrate __NAME__
```

for example if you generated a users entity, just type the following to generate migration for it 

```bash
$ npm run typeorm:migrate users
```


- to run migration to the database type 

```bash 
$ npm run typeorm:run
```

and that's it

- typeorm is exposed through this command 

```bash
$ npm run typeorm
```

the configs for typeorm are in `.env.example` (which you should rename it)

read more [here](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md)

[video](https://www.youtube.com/watch?v=ZONommzfUk8) showing me creating 

- CRUD enpoints
- Users Service
- Users Entity

and do some CRUD on them in under 5 min

