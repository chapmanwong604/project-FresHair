import {Bearer} from 'permit';
import jwtSimple from 'jwt-simple';
import express from 'express';
import jwt from './jwt';

const permit = new Bearer({
    query:"access_token"
})

export async function isLoggedInClient(
                        req:express.Request,
                        res:express.Response,
                        next:express.NextFunction){
    try{
        const token = permit.check(req);
        if(!token){
            return res.status(401).json({msg:"Permission Denied"});
        }
        const payload = jwtSimple.decode(token,jwt.jwtSecret);
        if(payload.role == "client"){
            return next();
        }else {
            return res.status(401).json({msg:"Permission Denied"});
        }
        }
    catch(e){
        return res.status(401).json({msg:"Permission Denied"});
    }
}

export async function isLoggedInStylist(
    req:express.Request,
    res:express.Response,
    next:express.NextFunction){
try{
const token = permit.check(req);
if(!token){
return res.status(401).json({msg:"Permission Denied"});
}
const payload = jwtSimple.decode(token,jwt.jwtSecret);
if(payload.role == "stylist"){
    return next();
}else {
    return res.status(401).json({msg:"Permission Denied"});
}

}
catch(e){
return res.status(401).json({msg:"Permission Denied"});
}
}