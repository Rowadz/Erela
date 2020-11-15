import 'reflect-metadata'
import 'module-alias/register'
import {
  createExpressServer,
  useContainer,
  Action,
  UnauthorizedError,
} from 'routing-controllers'
import { IncomingHttpHeaders } from 'http'
import { Container } from 'typedi'
import { connectWithDB } from '@entities'
import { config } from 'dotenv'
import { Express } from 'express'
import { sync } from 'glob'
import { join, basename } from 'path'
import { Connection, getConnection } from 'typeorm'
import { DeepPartial } from 'utility-types'
import { decode, verify } from 'jsonwebtoken'
import { UsersEntity } from '@entities'
config()

const { APP_PORT, EXT, JWT_SECRET } = process.env

const init = async () => {
  const getJWT = ({ authorization }: IncomingHttpHeaders): string | null => {
    if (authorization) {
      const [, token] = authorization.split(' ')
      return token
    } else {
      return null
    }
  }

  const decodeJWT = (token: string): DeepPartial<UsersEntity> =>
    decode(token) as DeepPartial<UsersEntity>

  const controllersPath = join(__dirname, `controllers/**/*.controller.${EXT}`)
  const controllersNames = sync(controllersPath).map((path: string) => ({
    name: basename(path),
  }))
  console.group('Controller Names'.cyan.italic.bold)
  console.table(controllersNames)
  console.groupEnd()
  const app: Express = createExpressServer({
    controllers: [controllersPath],
    async authorizationChecker(action: Action) {
      try {
        const token = getJWT(action.request.headers)

        if (!token) throw new UnauthorizedError()
        if (!verify(token, JWT_SECRET as string)) throw new UnauthorizedError()

        const decodedUser: DeepPartial<UsersEntity> = decodeJWT(token)

        await getConnection().getRepository(UsersEntity).findOne(decodedUser.id)
        return true
      } catch {
        throw new UnauthorizedError()
      }
    },
    async currentUserChecker(action: Action) {
      try {
        const token = getJWT(action.request.headers)
        
        if (!token) throw new UnauthorizedError()

        const decodedUser: DeepPartial<UsersEntity> = decodeJWT(token)
        
        return await getConnection()
          .getRepository(UsersEntity)
          .findOne(decodedUser.id)
      } catch {
        throw new UnauthorizedError()
      }
    },
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
