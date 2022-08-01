import { Knex } from "knex";

export class ClientInfoService {
  constructor(private knex: Knex) {}

  async registerClient(
    username: string,
    password: string,
    email: string,
    phone: number,
    gender: string,
    profile_pic: string
  ) {
    let result = await this.knex.raw(
      `INSERT INTO client_info (username,password,email,phone,gender,profile_pic) values (?,?,?,?,?,?)`,
      [username, password, email, phone, gender, profile_pic]
    );
    return result;
  }

  async getClientInfo(clientId: number) {
    let result = await this.knex.raw(
      `SELECT username,email,phone,gender,profile_pic FROM client_info WHERE id =?`,
      [clientId]
    );
    return result.rows;
  }

  async updateClientInfo(username:string,phone:number,gender:string,clientId:number){
    let result = await this.knex.raw(
      `UPDATE client_info SET username=?, phone=?, gender=? WHERE id =?`,
      [username,phone,gender,clientId]
    )
    return result.rows;
  }
}
