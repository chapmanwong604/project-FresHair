import React, { useState } from "react";
import "./AddTimeSlot.css";
import { useForm } from "@mantine/hooks";

// import 'antd/dist/antd.css';
import "antd/lib/time-picker/style/index.css";
import "antd/lib/style/default.css";
import "antd/lib/date-picker/style/css";

import { RangeCalendar } from "@mantine/dates";
import { useAppSelector } from "../hooks";
import { TimePicker } from "antd";
import { API_ORIGIN } from "../api";
import { Button } from "@mantine/core";
import Swal from "sweetalert2";

export default function AddTimeSlot() {
  const { user } = useAppSelector((state) => state.user);


  const form = useForm({
    initialValues: {
      dateRange: [],
      timeRange: [],
    },
  });

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(Date.now()),
    new Date(Date.now()),
  ]);

  const [timeRange, setTimeRange] = useState<[string | null, string | null]>([
    "00:00",
    "23:30",
  ]);

  const onChange = (time: any, timeString: [string, string]) => {
    setTimeRange(timeString);
  };

  // Format for antd TimePicker
  const format = "HH:mm";

  async function handleSubmit(
    dateRange: [Date | null, Date | null],
    timeRange: [string | null, string | null]
  ) {
    const formData = [user?.id, dateRange, timeRange];

    try {
      if (!user?.role) {
        Swal.fire({
          title: "開放時段失敗",
          text: "你唔係髮型師，唔可以改更表。",
          icon: "error",
          // timer: 1500
        });
        return;
      } else if (!dateRange[0]) {
        Swal.fire({
          title: "開放時段失敗",
          text: "請選擇至少一日去開放。",
          icon: "error",
          // timer: 1500
        });
        return;
      } else if (!timeRange[0] || !timeRange[1]) {
        Swal.fire({
          title: "開放時段失敗",
          text: "請選擇你想開放嘅時間。",
          icon: "error",
          // timer: 1500
        });
        return;
      }
      // else if (timeRange[0] === timeRange[1]) {
      //     Swal.fire({
      //         title: "開放時段失敗",
      //         text: "請至少開放半小時的預約時段。",
      //         icon: "error",
      //         // timer: 1500
      //     })
      //     return
      // }

      if (!dateRange[1]) {
        dateRange[1] = dateRange[0];
        // console.log(dateRange);
      }

      const res = await fetch(`${API_ORIGIN}timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success === true) {
        Swal.fire({
          title: "開放時段成功",
          // text: "",
          icon: "success",
          timer: 1500,
        });
        //   nav("/login")
        return;
      } else {
        Swal.fire({
          title: "開放時段失敗",
          icon: "error",
          text: result.msg,
        });
        //   nav("/login")
        return;
      }
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: "開放時段失敗",
        text: JSON.stringify(error),
        icon: "error",
      });
    }
  }

  // useEffect(() => {
  //     addTimeSlot(dateRange, timeRange)
  // }, [dateRange, timeRange])

  return (
    <div className="AddTimeSlot">

      <div className="instruction">在此新增預約時段</div>
      <div className="time-slot-text">
        <span className="note-asterisk">*</span> 你可以連續選擇多個日子，再揀選營業時間。
      </div>
      <div className="time-slot-text">
        時段開放後可給客人預約。
      </div>
      <form onSubmit={form.onSubmit(() => handleSubmit(dateRange, timeRange))}>
        <div className="date-time-select-box">
          <div className="outer-grid">
            <h5 className="step-box">
              <div className="steps-text">第1步: 選擇日期</div>
            </h5>
            <div className="calendar">
              <RangeCalendar
                value={dateRange}
                onChange={setDateRange}
                allowSingleDateInRange={true}
                minDate={new Date(Date.now())}
                size={"xs"}
              />
            </div>
          </div>

          {/* {dateRange.map((date, i: number) => (
              <div key={i}>{date?.toLocaleDateString()}</div>
            ))} */}

          <div className="outer-grid">
            <h5 className="step-box">
              <div className="steps-text">第2步: 選擇時間</div>
            </h5>

            <TimePicker.RangePicker
              onChange={onChange}
              placeholder={["開始營業", "結束營業"]}
              bordered={false}
              minuteStep={30}
              secondStep={10}
              format={format}
            />
          </div>

          <div className="outer-grid">
            <h5 className="step-box">
              <div className="steps-text">第3步: 確認已選日期及時間</div>
            </h5>


            <div className="selected-date-time">
              <div>
                <div className="selected-item">日期:</div>
                <div className="selected-item">時間:</div>
              </div>
              <div>
                <div className="selected-data">
                  由 <span className="steps-text">{dateRange[0]?.toLocaleDateString()}</span> 至
                  <span className="steps-text">{dateRange[1]?.toLocaleDateString()}</span>
                </div>
                <div className="selected-data">
                  由 <span className="steps-text">{timeRange[0]}</span> 至
                  <span className="steps-text">{timeRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          <Button className="step-box" type="submit" color="retro-blue">
            開放預約時段
          </Button>
        </div>
      </form>
    </div>
  );
}
