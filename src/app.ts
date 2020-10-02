import 'reflect-metadata'
import 'module-alias/register'
import { createExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import { connectWithDB } from '@entities'
import { config } from 'dotenv'
import { Express } from 'express'
import { sync } from 'glob'
import { join, basename } from 'path'
import { Connection } from 'typeorm'
config()

const { APP_PORT, EXT } = process.env

const init = async () => {
  const controllersPath = join(__dirname, `controllers/**/*.controller.${EXT}`)
  const controllersNames = sync(controllersPath).map((path: string) => ({
    name: basename(path),
  }))
  console.group('Controller Names'.cyan.italic.bold)
  console.table(controllersNames)
  console.groupEnd()
  const app: Express = createExpressServer({
    controllers: [controllersPath],
  })
  app.listen(APP_PORT, () => {
    // tslint:disable-next-line: no-console
    console.log(`🚀 App started on port ${APP_PORT} 🚀`.green.bold)
  })
  const con: Connection = await connectWithDB()
  // TODO:: loop through your services and pass the db to it
  // TODO:: then each service will available through the DO we have
  // TODO:: in each controller
  // Container.set(ServiceClass, new service(con))
  useContainer(Container)
}

init()
