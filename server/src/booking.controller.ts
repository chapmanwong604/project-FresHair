import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import jwtSimple from 'jwt-simple';
import jwt from "../User/Password_JWT/jwt";
import moment from "moment";
import { sendEMail } from "../User/emailNoti";

export type BookingSubmitted = {
  client_id: number;
  hair_stylist_info_id: number;
  date: string;
  time: string;
  plan_id: number;
  rating: number;
  special_request: string | null;
  status: string;
  token: string;
};

export class BookingController {
  constructor(private BookingService: BookingService) {}

  post = async (req: Request, res: Response) => {
    try {
      let bookingInfo = req.body;
      const token = bookingInfo.token;
      const payload = jwtSimple.decode(token,jwt.jwtSecret);
      
      const bookingSubmitted: BookingSubmitted = {
        client_id: payload.id,
        hair_stylist_info_id: bookingInfo.hair_Stylist_info_id,
        date: bookingInfo.date,
        time: bookingInfo.time,
        plan_id: bookingInfo.plan_id,
        rating: bookingInfo.rating,
        special_request: bookingInfo.special_request,
        status: bookingInfo.status,
        token: bookingInfo.token
      };
      
      if (!bookingSubmitted) {
        return new Error("ERROR: Missing Booking Information");
      }
      //checking Haitstylist's Time
      let itemTime = await this.BookingService.getItemTime(bookingSubmitted.plan_id)
      let startTime = moment(bookingSubmitted.time, "HH:mm")
      let endTime = moment(bookingSubmitted.time, "HH:mm").add(itemTime[0].item_time, "minutes")

      
      for (let i = startTime; i < endTime; startTime.add(30, "minutes")) {
        let checkTimeSlot = await this.BookingService.checkBookedTimeSlot(bookingSubmitted.hair_stylist_info_id, bookingSubmitted.date, i.format("HH:mm"));

        if (checkTimeSlot.length == 0) {
          res.json({ success: false });
          return
        }
      }

      let json = await this.BookingService.PostBooking(bookingSubmitted);
      let getMail = await this.BookingService.getFullDetails(bookingSubmitted.hair_stylist_info_id)
      // console.log("GETSTYLISTMAIL:",getMail[0].email);
      
      let email = getMail[0].email
      sendEMail("newBooking",email)
      res.json({ success: true, JSON: json });
    } catch (error) {
      if (error instanceof Error) {
        res.json({ success: false, msg: error.message });
        console.log(error)
      }
    }
  };
}
