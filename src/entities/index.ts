import { createConnection, Connection } from 'typeorm'
import { config } from 'dotenv'
import { join } from 'path'
import 'reflect-metadata'
import 'colors'
config()
const { DB_HOST, DB_USER, DB_PASS, TYPEORM_DATABASE, EXT } = process.env

export const connectWithDB = async (): Promise<Connection> => {
  const connection: Connection = await createConnection({
    type: 'sqlite',
    database: TYPEORM_DATABASE as string,
    entities: [`/**/*.${EXT}`].map((path) => join(__dirname, path)),
    subscribers: [`/**/*.${EXT}`].map((path) =>
      join(__dirname, '../subscribers', path)
    ),
  })
  await connection
    .synchronize(false) // ! pass true to drop everything and create them again [ DO NOT DO IT ON PROD ]
    // tslint:disable-next-line: no-console
    .then(() => console.log('💾 Connected with DB 💾'.green.bold))
    .catch(() => console.error('Faild to sync with DB'.red.bold))

  return connection
}
