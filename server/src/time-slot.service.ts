import { timeEnd } from 'console';
import {Knex} from 'knex';

export class TimeSlotService{
    constructor(
        private knex:Knex,
    ){}
    
    async GetTimeSlot(id: any, date:string){


        let result = await this.knex.raw(
            `SELECT date,time,available FROM timeslot WHERE date = DATE'${date}' AND hair_stylist_info_id=${id} ORDER BY time;`)

        return result.rows
    }

    async ChangeTimeSlot(id: any, date: string, time: string, available: boolean){

        let result = await this.knex("timeslot")
        .where({
            hair_stylist_info_id: id,
            date: date,
            time: time,
        })
        .update({
            available: available
        })

        return
    }
}