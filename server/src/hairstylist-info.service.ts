import { Knex } from "knex";
import { HairStylistInfo } from "./api.types";

export class HairStylistInfoService {
  constructor(private knex: Knex) {}

  // Getting HairStylist Info with Filtered Options

  async getFilterHairStylist(
    gender: any,
    district: any,
    services: any
  ): Promise<HairStylistInfo[]> {
    // console.log(gender,district,services)

    if (gender !== "男" && gender !== "女") {
      gender = "";
    }

    let result = await this.knex("hair_stylist_info")
      .select(
        "username",
        // "password",
        "email",
        "phone",
        "gender",
        "profile_pic",
        "bio",
        "location",
        "service_tag",
        "image",
        "rating",
        "district",
        "id"
      )
      .modify((queryBuilder) => {
        if (gender) queryBuilder.where("gender", "=", gender);
        if (district) queryBuilder.whereIn("district", district);
        if (services)
          queryBuilder.andWhereRaw("service_tag @> (?)", [services]);
      });

    // console.log(result)
    return result;
  }

  // Getting Hair Stylist Full Info:
  async getFullDetails(hairStylistId: number) {
    let result = await this.knex.raw(
      `SELECT username,email,phone,gender,profile_pic,bio,location,service_tag,image,rating,district,hair_stylist_info_id,item_description,item_time,price,plan.id as plan_id FROM hair_stylist_info FULL OUTER JOIN plan ON hair_stylist_info.id = plan.hair_stylist_info_id WHERE hair_stylist_info.id = (?) `,
      [hairStylistId]
    );
    return result.rows;
  }

  // Getting Hair Stylist Info:

  // async getHairStylistInfo(): Promise<HairStylistInfo[]> {
  //   const result = await this.knex/* ("hair_stylist_info") */
  //     // .select(
  //     //   "username",
  //     //   // "password",
  //     //   "email",
  //     //   "phone",
  //     //   "gender",
  //     //   "profile_pic",
  //     //   "bio",
  //     //   "location",
  //     //   "service_tag",
  //     //   "image",
  //     //   "rating",
  //     //   "district"
  //     // )
  //     // .where("gender", gender)
  //     // .where("district", district)
  //     // .whereRaw('? = ANY(service_tag)', services);
  //     .raw(`SELECT * FROM hair_stylist_info`)
  //   return result;
  // }

  // Posting Hair Stylist Info:

  async registerHairStylist(
    username: string,
    password: string,
    email: string,
    phone: number,
    gender: string,
    bio: string,
    district: string,
    location: string,
    service_tag: string,
    profile_pic: string,
    imageFilename: string
    // rating: number
  ) {
    let result = await this.knex.raw(
      `INSERT INTO 
      hair_stylist_info (username, password, email, phone, gender,bio,district, location, service_tag,profile_pic,image,rating) values (?,?,?,?,?,?,?,?,?,?,?,0)`,
      [
        username,
        password,
        email,
        phone,
        gender,
        bio,
        district,
        location,
        service_tag,
        profile_pic,
        imageFilename,
      ]
    );

    // console.log(result);

    return result;
  }
  async updateHairStylist(
    username: string,
    phone: number,
    gender: string,
    bio: string,
    district: string,
    location: string,
    service_tag: string,
    hairStylistId: number
  ) {
    let result = await this.knex.raw(
      `UPDATE hair_stylist_info SET username=?,phone=?,gender=?,bio=?,district=?,location=?,service_tag=? WHERE id=?`,
      [
        username,
        phone,
        gender,
        bio,
        district,
        location,
        service_tag,
        hairStylistId,
      ]
    );
    return result.rows;
  }

async getDetailsByRating() {
  let result = await this.knex.raw(
    `SELECT username,profile_pic,location,service_tag,rating,district,id as hair_stylist_info_id FROM hair_stylist_info ORDER BY rating DESC;`
  );
  return result.rows.slice(0,5);
}
}

