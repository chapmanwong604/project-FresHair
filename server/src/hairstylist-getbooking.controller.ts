import { log } from "console";
import { Request, Response } from "express";
import moment from "moment";
import { sendEMail } from "../User/emailNoti";
import { HairStylistBookingService } from "./hairstylist-getbooking.service";

export class HairStylistBookingController {
  constructor(private hairstylistBookingService: HairStylistBookingService) {}

  get = async (req: Request, res: Response) => {
    try {
      const hairStylistId = req.params.id;

      let json = await this.hairstylistBookingService.getMyBooking(
        +hairStylistId
      );
      //   console.log(json)
      res.json(json);
    } catch (error) {
      res.json({ error: error });
    }
  };

  confirm = async (req: Request, res: Response) => {
    try {
      const booking = req.params;
      const bookingId = req.params.bookingId;
      const userId = req.params.userId;
      const date = req.params.date;
      const time = req.params.time;
      const itemTime = req.params.itemTime;

      let startTime = moment(time, "HH:mm");
      let endTime = moment(time, "HH:mm").add(itemTime, "minutes");

      let canUpdate = true;

      for (let i = startTime; i < endTime; startTime.add(30, "minutes")) {
        let checkTimeSlot =
          await this.hairstylistBookingService.checkBookedTimeSlot(
            +userId,
            date,
            i.format("HH:mm")
          );
        if (checkTimeSlot.length == 0) {
          canUpdate = false;
          res.json({ success: false });
          return;
        }
      }

      startTime = moment(time, "HH:mm");
      endTime = moment(time, "HH:mm").add(itemTime, "minutes");

      if (canUpdate) {
        // changing the time slot
        for (let i = startTime; i < endTime; startTime.add(30, "minutes")) {
          let updateTimeSlot =
            await this.hairstylistBookingService.updateBookedTimeSlot(
              +userId,
              date,
              i.format("HH:mm")
            );
        }

        // changing the booking status
        let confirmResult = await this.hairstylistBookingService.confirmBooking(
          +bookingId
        );

        //send E-mail Noti
        // log("LOADING EMAIL:................................................................")
        let email = await this.hairstylistBookingService.getEmailByBookingId(
          bookingId
        );
        // log("SENDING E-Mail Noti", email.email);
        sendEMail("acceptBooking", email.email);

        res.json({ success: true, msg: confirmResult });
      }
    } catch (error) {
      res.json({ error: error });
    }
  };

  reject = async (req: Request, res: Response) => {
    try {
      const bookingId = req.params.id;
      let json = await this.hairstylistBookingService.rejectBooking(+bookingId);
      log("LOADING EMAIL:................................................................")
      let email = await this.hairstylistBookingService.getEmailByBookingId(
        bookingId
      );
      log("SENDING E-Mail Noti REJECT", email.email);
      sendEMail("rejectBooking", email.email);
      res.json({ success: true, msg: "Rejected." });
    } catch (error) {
      res.json({ error: error });
    }
  };

  getTodayBooking = async (req: Request, res: Response) => {
    // console.log("HI")
    try {
      const hairStylistId = req.params.id;
      let json = await this.hairstylistBookingService.getTodayBooking(
        +hairStylistId,

      );
      res.json(json);
    } catch (error) {
      res.json({ error: error });
    }
  };
}
