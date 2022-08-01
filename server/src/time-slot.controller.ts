import { Request, Response } from 'express';
import { TimeSlotService } from './time-slot.service';



export class TimeSlotController {

    constructor(private TimeSlotService: TimeSlotService) { }

    get = async (req: Request, res: Response) => {
        try {
            const id: any = req.params.id
            if (!id && req.query.date) { return new Error("Missing ID / Date") }
            let json = await this.TimeSlotService.GetTimeSlot(req.params.id, req.params.date);
            res.json(json);
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({ success: false, msg: error.message })
            }
        }
    }

    patch = async (req: Request, res: Response) => {
        try {
            let id = JSON.parse(req.params.id);
            let date = req.params.date;
            let time = req.params.time;
            let available = JSON.parse(req.params.available);

            available = (available === true ? false : true);
            let json = await this.TimeSlotService.ChangeTimeSlot(id, date, time, available);
            res.json({ success: true });
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({ success: false, msg: error.message })
            }
        }
    }
}