import { Knex } from 'knex';

export class TimeTableService {
    constructor(private knex: Knex) { }

    async checkDuplicate(hairStylistID: number, newDate: any, newTime: any) {
        // check whether the time slots are duplicated
        let result = await this.knex
            .raw(`select id from timeslot WHERE hair_stylist_info_id=? AND date=? AND time=?;`, [hairStylistID, newDate, newTime])

        return result
    }

    async addTimeSlot(hairStylistID: number, newDate: any, newTime: any) {
        // input new time slot

        await this.knex('timeslot').insert({
            hair_stylist_info_id: hairStylistID,
            date: newDate,
            time: newTime,
            available: true
        })

        return
    }

}