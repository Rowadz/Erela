# Erela

**Welcome to Erela ツ**

Erela is a Nodejs - express starter with simple cli generator.

It was created for these reasons: 
 
- To create **very simple and small** API's with orgnized code
- To use the power of decorator and TypeScript from [routing-controllers](https://github.com/typestack/routing-controllers)

I like [Nestjs](https://nestjs.com/), [Feathersjs](https://feathersjs.com/) and [Sailsjs](https://sailsjs.com/) but sometimes they are too much for some of the things I do, so I created erela for myself.


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

