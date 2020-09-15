import { createConnection, Connection } from 'typeorm'
import { config } from 'dotenv'
import 'reflect-metadata'
import 'colors'
config()
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

export const connectWithDB = async (): Promise<Connection> => {
  const connection: Connection = await createConnection({
    type: 'sqlite',
    database: `${DB_NAME}.db`,
    entities: [__dirname + '/**/*.entity.ts'],
  })
  await connection
    .synchronize(true) // ! pass true to drop everything and create them again [ DO NOT DO IT ON PROD ]
    // tslint:disable-next-line: no-console
    .then(() => console.log('💾 Connected with DB 💾'.green.bold))
    .catch(() => console.error('Faild to sync with DB'.red.bold))

  return connection
}
