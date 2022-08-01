import { Knex } from "knex";

export class UserService {

    constructor(private knex:Knex){}

    async getClientInfo(clientEMail:string,role:string){
        // console.log(clientEMail);
        if (role == "client"){
            let info = await this.knex.from("client_info").select('password',"id","username").where('email',clientEMail)
            if(!info){
                throw new Error("Client not found in Database");
            }
            const username:string = info[0].username
            const id:string = info[0].id
            const password:string = info[0].password
            // console.log(ClientInfo);
            return [{username,id,password,role}]
        }
        if (role == "stylist"){
            let info = await this.knex.from("hair_stylist_info").select('password',"id","username").where('email',clientEMail)
            if(!info){
                throw new Error("Stylist not found in Database");
            }
            const username:string = info[0].username
            const id:string = info[0].id
            const password:string = info[0].password
            // console.log(ClientInfo);
            return [{username,id,password,role}]
        }else {
            throw new Error("Role is undefined");
        }
    }

}