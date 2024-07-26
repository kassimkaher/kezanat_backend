import client from './credintial';
class DB {

  private isConnected: boolean = false;

  constructor() {

  }

  public async connect(): Promise<boolean> {
    try {
      await client.connect();
      this.isConnected = true;
      return true;
    } catch (err) {
      this.isConnected = false;
      throw err;
    }
  }
}

export default DB;
