import { Knex } from "knex";
import { BookingController } from "./booking.controller";

export class ClientBookingService {
  constructor(private knex: Knex) {}

  async getMyBooking(clientId: number) {
    // console.log("hhi");
    let result = await this.knex.raw(
      `SELECT date,time,status,item_description,location,username,phone,booking.id,booking.rating
            FROM 
                booking
                   FULL OUTER JOIN plan on booking.plan_id = plan.id
                   FULL OUTER JOIN hair_stylist_info on booking.hair_stylist_info_id = hair_stylist_info.id
            WHERE
                booking.client_id = ?
            ORDER BY
                booking.date DESC
            `,

      [clientId]
    );
    // console.log(result);
    return result.rows;
  }

  async updateBookingRating(
    rating: number,
    review: string,
    status: string,
    bookingId: number
  ) {
    // console.log(rating,review,bookingId)
    let result = await this.knex.raw(
      `UPDATE booking SET rating = ?,review = ? ,status = ? WHERE id = ?`,
      [rating, review, status,bookingId]
    );
    // console.log(result);
    return result.rows;
  }

  async calculateRating(bookingID: number) {
    // console.log("STEP1");
    let hairStylistID = await this.knex.raw(
      `SELECT hair_stylist_info_id FROM booking WHERE id = ?`,
      [bookingID]
    );
    // console.log("STEP2", hairStylistID.rows[0].hair_stylist_info_id);

    let rating = await this.knex.raw(
      `SELECT AVG(rating) FROM booking WHERE hair_stylist_info_id = ? AND rating >= 20`,
      [hairStylistID.rows[0].hair_stylist_info_id]
    );

    // console.log("STEP3", rating.rows[0].avg / 20);

    // console.log([
    //   Math.round(rating.rows[0].avg / 20),
    //   hairStylistID.rows[0].hair_stylist_info_id,
    // ]);

    // let result = this.knex.raw (`UPDATE hair_stylist_info SET rating = ? WHERE id = ?;`,[Math.round((rating.rows[0].avg)/20),hairStylistID.rows[0].hair_stylist_info_id])

    await this.knex("hair_stylist_info")
      .update({ rating: +Math.round(rating.rows[0].avg / 20) })
      .where("id", "=", +hairStylistID.rows[0].hair_stylist_info_id);
    // console.log(result)
  }

  async getUpComingBooking(clientId: number) {
    // console.log("hhi");
    let result = await this.knex.raw(
      `SELECT date,time,status,item_description,location,username,phone,booking.id,booking.rating
      FROM 
          booking
             FULL OUTER JOIN plan on booking.plan_id = plan.id
             FULL OUTER JOIN hair_stylist_info on booking.hair_stylist_info_id = hair_stylist_info.id
      WHERE
          booking.client_id = ? and booking.status ='已確認'
          
      ORDER BY
          booking.date ,booking.time;
            `,

      [clientId]
    );
    // console.log(result);
    return result.rows;
  }
}
