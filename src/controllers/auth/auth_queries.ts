

import client from '../../../src/credintial';
import { hydrate } from '../../../src/utils/orm';
import User from './user_model';

class AuthQueries {
  constructor() { }

  public async login(email: string): Promise<User | null> {
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rows.length === 0) {
       return null;
      }
      return hydrate(User, result.rows[0]);
    } catch (err) {
      throw err;
    }
  }

  public async isExist(email: string, phone: string): Promise<boolean> {
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);

      if (result.rows.length === 0) {
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  public async create(name: string, phone: string, email: string, password: string) {
    try {
      const result = await client.query('INSERT INTO users (name,email, password,phone) VALUES ($1, $2,$3,$4) RETURNING *', [name, email, password, phone]);

   
      return result.rows;
    } catch (err) {
      console.log(err);
      throw err;

    }
  }

  public async updateUser(email: string): Promise<User | null> {
    try {
      const result = await client.query('update users set name = $1,phone = $2 where email = $3', ['sdsd', 'sdsd', email]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      return hydrate(User, result.rows[0]);
    } catch (err) {
      throw err;
    }
  }

  public async creatTable(): Promise<boolean> {
    try {
      if (await this.checkIfTableExist()) {
        return true;
        
      }
      const result = await client.query('CREATE TABLE users (name VARCHAR(255),email VARCHAR(255),password VARCHAR(255),phone VARCHAR(255))');
      return true;
    } catch (err) {
      throw err;
    }
  }
  public async dropTable(): Promise<boolean> {
    try {
      const result = await client.query('DROP TABLE users');
      return true;
    } catch (err) {
      return true;
    }
  }
  public async checkIfTableExist(): Promise<boolean> {
    try {
      const result = await client.query('SELECT * FROM users ');
      return true;
    } catch (err) {
      return false;
    }
  }

}
export default AuthQueries;