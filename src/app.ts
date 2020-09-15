import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'
import { connectWithDB } from '@entities'
import { config } from 'dotenv'
import { Express } from 'express'
import { sync } from 'glob'
import { join, basename } from 'path'
config()

const { APP_PORT } = process.env

const init = async () => {
  const controllersPath = join(__dirname, 'controllers/*.controller.ts')
  const controllersNames = sync(controllersPath).map((path: string) => ({
    name: basename(path),
  }))
  console.group('Controller Names'.cyan.italic.bold)
  console.table(controllersNames)
  console.groupEnd()
  const app: Express = createExpressServer({
    controllers: [controllersPath],
  })
  app.listen(3030, () => {
    // tslint:disable-next-line: no-console
    console.log(`🚀 App started on port ${APP_PORT} 🚀`.green.bold)
  })
  await connectWithDB()
}

init()
