import { useEffect, useState } from 'react';
import './CurrentTimeSlot.css';
import {
    SimpleGrid,
    Textarea,
    Button,
    Avatar,
    Blockquote,
    Box,
    Chips, Chip, ScrollArea, Badge, Loader
} from "@mantine/core";
import Swal from 'sweetalert2';

import { Calendar } from '@mantine/dates';
import { API_ORIGIN } from "../api";
import { useAppSelector } from '../hooks';
import moment from 'moment';


export default function CurrentTimeSlot() {
    const { user, isLogin, error } = useAppSelector(state => state.user);


    const [date, setDate] = useState<Date | null>(new Date(Date.now()));
    const [timeSlotResult, SetTimeSlotResult] = useState([{ date: "", time: "", available: true }]);
    const [selectTime, setSelectTime] = useState("");
    const [available, setAvailable] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);



    async function getTimeSlotAvailability() {
        setIsDataLoading(true)
        try {
            const res = await fetch(`${API_ORIGIN}get-time-slot/${user?.id}/${date?.toLocaleDateString("en-CA")}`);
            const result = await res.json();
            // console.log("TIME SLOT FETCHED FROM SERVER:", result);

            return result;
        } catch (error) {
            // console.log(error)
            Swal.fire({
                title: "查不到時段是否已開放",
                text: JSON.stringify(error),
                icon: "error",
            })
        } finally {
            setIsDataLoading(false)
        }
    }

    async function changeTimeSlotAvailability(time: string, available: boolean) {
        try {
            const res = await fetch(`${API_ORIGIN}get-time-slot/${user?.id}/${date?.toLocaleDateString("en-CA")}/${time}/${available}`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
            )
            const result = await res.json();
            // console.log("TIME SLOT CHANGED", result)
        } catch (error) {
            // console.log(error)
            Swal.fire({
                title: "改變營業時段失敗",
                text: JSON.stringify(error),
                icon: "error",
            })
        }
    }

    useEffect(() => {
        const gettingTimeSlot = async () => {
            const TimeSlotResultFromFetch = await getTimeSlotAvailability();
            // console.log("ONCHANGE:", TimeSlotResultFromFetch);
            SetTimeSlotResult(TimeSlotResultFromFetch)
        }
        gettingTimeSlot();
    }, [date, available])

    return (
        <div className="CurrentTimeSlot">
            <div className="date-time-select-box">

                <div className="instruction">在此查看及更改預約時段</div>
                <div className="time-slot-text">
                    <span className="note-asterisk">*</span> 你可以在月曆查看已開放的日子及時間。
                </div>
                <div className="timetable-changer">
                    <div className="calendar">
                        <Calendar
                            value={date}
                            onChange={setDate}
                            minDate={new Date(Date.now())}
                            size={'xs'}
                        />
                    </div>
                    <SimpleGrid

                        cols={1}>
                        <div className="time-slot-box">

                            {<div className="checked-date">正在查看的日期: {date?.toLocaleDateString()}</div>}
                            <div>

                                {isDataLoading && (
                                    <>
                                        <Loader size="xl" color="retro-red" />
                                    </>
                                )}
                            </div>

                            {!isDataLoading &&
                                <div className="time-slot-box">
                                    {timeSlotResult.length == 0 ?
                                        <div>
                                            <div>
                                                呢日冇開放過任何預約時段。
                                            </div>
                                            <div>
                                                快啲去報更啦！
                                            </div>
                                        </div>
                                        :
                                        <>
                                            <div className="time-slot-text"><span className="note-asterisk">*</span> 你可以按下時段以將它暫停或重開。</div>
                                            <div className="time-slot-text">
                                                已開放時段為<span className="color-on"> 藍色</span>，未開放為<span className="color-off"> 灰色</span>。
                                            </div>
                                            <div className="time-slot-tags">
                                                {Array.isArray(timeSlotResult) && timeSlotResult.map((element, i: number) => (
                                                    <button className={"time-slot-button"}
                                                        key={i}
                                                        onClick={() => {
                                                            setAvailable(available === true ? false : true)
                                                            // setSelectTime(element.time.substring(0, 5))
                                                            changeTimeSlotAvailability(element.time.substring(0, 5), element.available)
                                                        }}>
                                                        <Badge className={element.available === true ? "time-slot-open" : "time-slot-closed"} variant="outline">
                                                            {element.time.substring(0, 5)}
                                                            {element.available}
                                                        </Badge>
                                                    </button>
                                                ))}

                                            </div>
                                        </>
                                    }
                                </div>
                            }
                        </div>
                    </SimpleGrid>
                </div>
            </div>
        </div>
    )
}