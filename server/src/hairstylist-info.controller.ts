import { Request, Response } from "express";
import { extractSingleFile, form } from "../uploadimage";
import { HairStylistInfoService } from "./hairstylist-info.service";
import formidable from "formidable";
import { hashPassword } from "../pw_hash";
import { sendEMail } from "../User/emailNoti";

export class HairStylistInfoController {
  constructor(private hairStylistInfoService: HairStylistInfoService) {}

  get = async (req: Request, res: Response) => {
    try {
      if (!req.query) {
        res.status(400).json({ error: "收唔到。" });
      }

      let gender = req.query.gender;
      let district = req.query.district;
      let services = req.query.services;

      if (typeof district === "string") district = [district];
      if (typeof services === "string") services = [services];

      let json = await this.hairStylistInfoService.getFilterHairStylist(
        gender,
        district,
        services
      );

      res.json(json);
    } catch (error) {
      if (error instanceof Error) {
        res.json({ success: false, msg: error.message });
        console.log(error.message);
      }
    }
  };

  post = async (req: Request, res: Response) => {
    form.parse(req, async (error, fields, files) => {
      try {
        let {
          username,
          password,
          email,
          gender,
          phone,
          bio,
          district,
          location,
          service_tag,
        } = fields;
        let file = extractSingleFile(files.profile_pic);
        let profilePicFilename = file?.newFilename || null;
        let image;
        let imageFilename = "";
        console.log("JSON.stringify(files.image)", JSON.stringify(files.image));
        if (Array.isArray(files.image)) {
          for (let i = 0; i < files.image.length; i++) {
            image = extractSingleFile(files.image[i]);
            if (image) {
              imageFilename += image.newFilename + ",";
            }
          }
          imageFilename = imageFilename.slice(0, -1);
        } else {
          image = extractSingleFile(files.image);
          if (image) {
            imageFilename = image?.newFilename;
          }
        }

        // console.log("req.body: ", req.body);
        // console.log("fields: ", fields);
        // console.log("files: ", profilePicFilename);

        if (profilePicFilename == null) {
          profilePicFilename = "No_Image.jpeg";
        }
        if (imageFilename == null) {
          imageFilename = "No_Image.jpeg";
        }
        if (
          Array.isArray(password) ||
          Array.isArray(username) ||
          Array.isArray(email) ||
          Array.isArray(gender) ||
          Array.isArray(phone) ||
          Array.isArray(bio) ||
          Array.isArray(district) ||
          Array.isArray(location)
          //   ||Array.isArray(service_tag)
        ) {
          console.log("fields should not be array");
          return;
        }
        password = await hashPassword(password);

        let result = await this.hairStylistInfoService.registerHairStylist(
          username,
          password,
          email,
          +phone,
          gender,
          bio,
          district,
          location,
          `{${service_tag}}`,
          profilePicFilename,
          `{${imageFilename}}`
        );
        if (result.rowCount == 1) {
          sendEMail("register", email);
          res.json({
            success: true,
          });
        }
      } catch (error) {
        // console.log(error);

        if (String(error).includes("unique")) {
          res.json({ error: "電郵已經被註冊" });
        }
      }
    });
  };

  getFullDetails = async (req: Request, res: Response) => {
    try {
      // console.log(req.params)
      const hairStylistId = req.params.id;
      // console.log(hairStylistId)
      let json = await this.hairStylistInfoService.getFullDetails(
        +hairStylistId
      );
      res.json(json);
    } catch (error) {
      res.json({ error: error });
    }
  };

  patch = async (req: Request, res: Response) => {
    try {
      const username = req.body[0].username;
      const phone = req.body[0].phone;
      const gender = req.body[0].gender;
      const bio = req.body[0].bio;
      const district = req.body[0].district;
      const location = req.body[0].location;
      const service_tag = req.body[0].service_tag;
      const hairStylistId = req.body[1];
      let result = await this.hairStylistInfoService.updateHairStylist(
        username,
        phone,
        gender,
        bio,
        district,
        location,
        `{${service_tag}}`,
        hairStylistId
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

  getDetailsByRating = async (req: Request, res: Response) => {
    try {
      let result = await this.hairStylistInfoService.getDetailsByRating();
      res.json(result);
    } catch (error) {
      res.json({ error: error });
      console.log(error);
    }
  };
}