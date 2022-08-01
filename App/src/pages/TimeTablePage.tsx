import React, { useEffect, useState } from "react";
import "./TimeTablePage.css";
import { Box, SegmentedControl } from "@mantine/core";
import { useAppSelector } from "../hooks";
import CurrentTimeSlot from "../components/CurrentTimeSlot";
import AddTimeSlot from "../components/AddTimeSlot";

function TimeTablePage() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);

  const [timeTableState, setTimeTableState] = useState("current");

  return (
    <div className="TimeTablePage">
      {/* {user?.role === "stylist" ? */}
      <h2 className="page-header">你的更表</h2>
      <Box sx={{ maxWidth: 340 }} mx="auto">
        {/* <h2>{user?.username}'s</h2> */}

        <SegmentedControl
          value={timeTableState}
          onChange={setTimeTableState}
          radius={20}
          color="retro-blue"
          transitionDuration={700}
          transitionTimingFunction="linear"
          className="login-segment"
          data={[
            { label: "現有開放時段", value: "current" },
            { label: "新增開放時段", value: "add" },
          ]}
        />

        {timeTableState === "current" ? <CurrentTimeSlot /> : <AddTimeSlot />}
      </Box>
      {/* : */}
      <></>
      {/* } */}
    </div>
  );
}

export default TimeTablePage;
