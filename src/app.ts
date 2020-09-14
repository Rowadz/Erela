import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'

createExpressServer({
  controllers: [__dirname + '/controllers/*.controller.ts'],
}).listen(3030)
