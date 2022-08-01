import express, { Request, Response } from "express";
import { extractSingleFile, form } from "../uploadimage";
import { ClientInfoService } from "./client-info.service";
import { hashPassword } from "../pw_hash";
import formidable from "formidable";
import { sendEMail } from "../User/emailNoti";

export class ClientInfoController {
  constructor(private clientInfoService: ClientInfoService) {}

  post = async (req: Request, res: Response) => {
    form.parse(req, async (error, fields, files) => {
      try {
        let { username, password, email, gender, phone } = fields;
        let file = extractSingleFile(files.profile_pic);
        let imageFilename = file?.newFilename || null;

        // console.log("req.body: ", req.body);
        // console.log("fields: ", fields);
        // console.log("files: ", imageFilename);

        if (imageFilename == null) {
          imageFilename = "No_Image.jpeg";
        }
        if (
          Array.isArray(password) ||
          Array.isArray(username) ||
          Array.isArray(email) ||
          Array.isArray(gender) ||
          Array.isArray(phone)
        ) {
          // console.log("fields should not be array");
          return;
        }
        password = await hashPassword(password);

        let result = await this.clientInfoService.registerClient(
          username,
          password,
          email,
          +phone,
          gender,
          imageFilename
        );

        if (result.rowCount == 1) {
          sendEMail("register", email);
          res.json({
            success: true,
          });
        }

        // res.json(result);
        // console.log('fetch',result);
      } catch (error) {
        if (String(error).includes("unique")) {
          res.json({ error: "電郵已經被註冊" });
        } else {
          res.json({ error: error });
        }
      }
    });
  };

  get = async (req: Request, res: Response) => {
    try {
      const clientId = req.params.id;
      // console.log(clientId);
      let json = await this.clientInfoService.getClientInfo(+clientId);
      //   console.log(json)
      res.json(json);
    } catch (error) {
      res.json({ error: error });
    }
  };

  patch = async (req: Request, res: Response) => {
    try {
      // console.log(req.body)
      const username = req.body[0].username;
      const phone = req.body[0].phone;
      const gender = req.body[0].gender;
      const clientId = req.body[1];
      // console.log(req.body, username, phone, gender, clientId);
      let result = await this.clientInfoService.updateClientInfo(
        username,
        phone,
        gender,
        clientId
      );
      if (!result) {
        throw new Error("Cannot insert into database.");
      }
      res.json({
        success: true,
      });
    } catch (error) {
      res.json({ error: error });
      console.log(error);
    }
  };
}
