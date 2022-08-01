import { Request, Response } from 'express';
import { TimeTableService } from './timetable.service';
import moment from 'moment';

export class TimeTableController {

    constructor(private timeTableService: TimeTableService) { }

    addTimeSlot = async (req: Request, res: Response) => {
        try {
            if (!req.body) {
                res.status(400).json({ error: "收唔到。" })
            }
            let hairStylistID = req.body[0]
            let dateRange = req.body[1]
            let timeRange = req.body[2]
            // console.log(hairStylistID, dateRange, timeRange)

            let timeRangeList: string[] = []

            const loopThroughTimeRange = async (timeRange: (string | number | Date)[]) => {
                let startTime = moment(new Date('01/01/1970 ' + timeRange[0]))
                let endTime = moment(new Date('01/01/1970 ' + timeRange[1]))
                for (let i = startTime; i <= endTime; i.add(30, 'm')) {

                    // variable i will be used to get all time in range
                    let newTime = moment(i).format("HH:mm")

                    timeRangeList.push(newTime)
                }
            }

            loopThroughTimeRange(timeRange)

            if (dateRange[0] === dateRange[1]) {

                let checkValue = 0;
                let newDate = moment(dateRange[0]).format("YYYY-MM-DD");

                for (let newTime of timeRangeList) {

                    // checking duplicates in time slot
                    let duplicate = await this.timeTableService.checkDuplicate(hairStylistID, newDate, newTime);

                    if (duplicate.rowCount > 0) {
                        checkValue = 1
                        res.json({ success: false, msg: "新增時段 同 現有時段 重疊。" })
                        return 1
                    }
                }
                if (checkValue !== 1) {
                    for (let newTime of timeRangeList) {

                        // posting new time slot
                        await this.timeTableService.addTimeSlot(hairStylistID, newDate, newTime);

                    }
                    res.json({ success: true })

                }

            } else {

                const loopThroughDateRange = async (dateRange: (string | number | Date)[]) => {

                    let startDate = new Date(dateRange[0]);
                    let endDate = new Date(dateRange[1]);

                    for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {

                        // variable i will be used to get all dates in range
                        let newDate = moment(i).format("YYYY-MM-DD")

                        for (let newTime of timeRangeList) {

                            // checking duplicates in time slot
                            let duplicate = await this.timeTableService.checkDuplicate(hairStylistID, newDate, newTime);

                            if (duplicate.rowCount > 0) {
                                return 1
                            }
                        }
                        for (let newTime of timeRangeList) {

                            // posting new time slot
                            await this.timeTableService.addTimeSlot(hairStylistID, newDate, newTime);

                        }
                    }

                }

                let result = await loopThroughDateRange(dateRange)

                if (result === 1) {
                    res.json({ success: false, msg: "新增時段 同 現有時段 重疊。" })
                } else {
                    res.json({ success: true })
                }

            }

        }
        catch (error) {

            if (error instanceof Error) {
                console.log(error)
                res.json({ success: false, msg: error.message })
            }

        }
    }

}