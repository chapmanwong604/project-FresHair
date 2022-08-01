import { Knex } from "knex";
import moment from "moment";

export class HairStylistBookingService {
    constructor(private knex: Knex) { }

    async getMyBooking(hairStylistId: number) {

        let result = await this.knex.raw(
            `SELECT date,time,status,item_description, special_request,item_time, hair_stylist_info.location,client_info.username,client_info.phone,booking.id
            FROM 
                booking
                   FULL OUTER JOIN plan on booking.plan_id = plan.id
                   FULL OUTER JOIN client_info on booking.client_id = client_info.id
                   FULL OUTER JOIN hair_stylist_info on booking.hair_stylist_info_id = hair_stylist_info.id
            
            WHERE
                booking.hair_stylist_info_id = ?
            ORDER BY date DESC ,time    
                `, [hairStylistId]

        )
        return result.rows
    }

    async checkBookedTimeSlot(userId: number, date: string, time: string) {
        let result = await this.knex("timeslot")
            .where({
                hair_stylist_info_id: userId,
                date: date,
                time: time,
                available: true
            })
        return result
    }

    async updateBookedTimeSlot(userId: number, date: string, time: string) {

        let result = await this.knex("timeslot")
            .where({
                hair_stylist_info_id: userId,
                date: date,
                time: time
            }).update({
                available: false
            }).returning("available")
        return result
    }

    async confirmBooking(bookingId: number) {

        let result = await this.knex("booking")
            .where({
                id: bookingId,
            })
            .update({
                status: "已確認"
            })
            .returning("status")

        return result
    }

    
    async rejectBooking(bookingId: number) {

        let result = await this.knex("booking")
            .where({
                id: bookingId,
            })
            .update({
                status: "已拒絕"
            })
            .returning("status")

        return result
    }

    async getEmailByBookingId(bookingId:any){
        let clientId;
        try {
            let res = await this.knex("booking")
            .where({id:+bookingId})
            .select("client_id")
            clientId=res[0].client_id
        } catch (error) {
            console.log(error)
        }

        try {
        let result = await this.knex("client_info")
        .select("email")
        .where({id:clientId})

        return result[0];
        } catch (error) {
            console.log(error)
        }

    }

    async getTodayBooking(hairStylistId: number) {

        let result = await this.knex.raw(
            `SELECT date,time,status,item_description, special_request,item_time, hair_stylist_info.location,client_info.username,client_info.phone,booking.id
            FROM 
                booking
                   FULL OUTER JOIN plan on booking.plan_id = plan.id
                   FULL OUTER JOIN client_info on booking.client_id = client_info.id
                   FULL OUTER JOIN hair_stylist_info on booking.hair_stylist_info_id = hair_stylist_info.id
            
            WHERE
                booking.hair_stylist_info_id = ? and
                booking.status = '已確認' and 
                booking.date =  CURRENT_DATE

            ORDER BY date DESC ,time    
                `, [hairStylistId]

        )
        return result.rows
    }
}




