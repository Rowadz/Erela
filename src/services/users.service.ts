import 'reflect-metadata'
import { Service } from 'typedi'
import { Connection } from 'typeorm'

// If this extended the Base service which you can generates
// just cann the super constructor and pass a typeorm repo to it
// then you have a basic curd
@Service()
export class UsersService  {
  constructor(db: Connection) {
    // super(db.getRepository(UsersEntity))
  }
}