import {Knex} from 'knex';
import { BookingSubmitted } from './booking.controller';

export class BookingService{
    constructor(
        private knex:Knex,
    ){}
    
    async PostBooking(book:BookingSubmitted){

             let result = await this.knex("booking").insert({
                client_id: book.client_id,
                hair_stylist_info_id: book.hair_stylist_info_id,
                date: new Date(book.date),
                time: book.time,
                plan_id: book.plan_id,
                rating: book.rating,
                special_request: book.special_request,
                status: book.status
              });
                  
              return result


    }

    async getItemTime(plan_id: number){
        let result = await this.knex .raw(`select item_time from plan where id = ?`,[plan_id])
        return result.rows
    }

    async checkBookedTimeSlot(hair_stylist_info_id: number, date: string, time: string) {
        let result = await this.knex("timeslot")
            .where({
                hair_stylist_info_id: hair_stylist_info_id,
                date: date,
                time: time,
                available: true
            })
        return result
    }

    async getFullDetails(hairStylistId: number) {
        let result = await this.knex.raw(
          `SELECT username,email,phone,gender,profile_pic,bio,location,service_tag,image,rating,district,hair_stylist_info_id,item_description,item_time,price,plan.id as plan_id FROM hair_stylist_info FULL OUTER JOIN plan ON hair_stylist_info.id = plan.hair_stylist_info_id WHERE hair_stylist_info.id = (?) `,
          [hairStylistId]
        );
        return result.rows;
      }
}