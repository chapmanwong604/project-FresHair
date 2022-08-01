import { Request, Response } from "express";
import moment from "moment";
import { ClientBookingService } from "./client-getbooking.service";

export class ClientBookingController {
  constructor(private clientBookingService: ClientBookingService) {}

  get = async (req: Request, res: Response) => {
    try {
      const clientId = req.params.id;
      // console.log(clientId);
      let json = await this.clientBookingService.getMyBooking(+clientId);
      //   console.log(json)
      res.json(json);
    } catch (error) {
      res.json({ error: error });
    }
  };

  patch = async (req: Request, res: Response) => {
    try {
      const rating = req.body[0].ratingValue
      const review = req.body[0].review;
      const status = req.body[0].status;
      const bookingId = req.body[1]

      let result = await this.clientBookingService.updateBookingRating(
        rating,
        review,
        status,
        bookingId
      );

      if (!result) {
        throw new Error("Cannot insert into database.");
      }
      if(result){this.clientBookingService.calculateRating(bookingId)}
      res.json({
        success: true,
      });
    } catch (error) {
      res.json({ error: error });
      console.log(error);
    }


  };

  getUpComingBooking = async (req: Request, res: Response) => {
    try {
      const clientId = req.params.id;
      let json = await this.clientBookingService.getUpComingBooking(+clientId);
      // console.log(json.length);
      // if(json.length==0){
      //   res.json({ msg:"no upcoming bookings"})
      // }
      let lastBooking =[]
      for(let item of json) {
        if( moment(item.date).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD")){
          lastBooking.push(item)
        }
      }
        // if(lastBooking.length == 0){
        //   res.json({ msg:"no upcoming bookings"})

        // }
        res.json(lastBooking[0]);
    } catch (error) {
      res.json({ error: error });
    }
  };
}
