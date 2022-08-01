import {Request,Response} from 'express';
import { UserService } from './UserService';
import jwtSimple from 'jwt-simple';
import jwt from './Password_JWT/jwt';
import {checkPassword} from './Password_JWT/pw_hash';
import fetch from 'node-fetch';
import { send } from 'process';
import{sendEMail} from './emailNoti'

export class UserController{

    constructor(private userService:UserService){}

    post = async (req:Request,res:Response)=>{

        try{
            if (!req.body.email || !req.body.password) {
                res.status(401).json({success:false,msg:"Wrong username/password01"});
                return;
            }
            const ClientEMail = req.body.email;
            const password = req.body.password; 
            const role = req.body.role;
            // console.log(ClientEMail,password);
            const clientInfo = (await this.userService.getClientInfo(ClientEMail,role));
            // console.log("ClientInfo",clientInfo);
            if(!clientInfo || !(await checkPassword(password,clientInfo[0].password))){
                res.status(401).json({success:false,msg:"Wrong username/password02"});
                return;
            }
            const payload = {
                id: clientInfo[0].id,
                username: clientInfo[0].username,
                role:clientInfo[0].role
            };
            const token = jwtSimple.encode(payload, jwt.jwtSecret);
            // console.log(ClientEMail);
            sendEMail("login",ClientEMail).catch(err => console.log(err));
            res.json({
                success:true,token: token
            });
        }catch(err){
            if (err instanceof Error) {
                console.log(err.message);
                res.status(500).json({success:false,msg:err.message})
              } else {
                console.log('Unexpected error', err);
              }
        }
    }
}