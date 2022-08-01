import { Box, SegmentedControl } from "@mantine/core";
import React, { useState } from "react";
import RegisterClient from "./RegisterClientPage";
import RegisterHairstylist from "./RegisterHairstylistPage";
import "./RegisterPage.css"
import { Link } from "react-router-dom";
import { ArrowBackUp, ChevronLeft } from "tabler-icons-react";

export default function RegisterPage() {
  const [identity, setIdentity] = useState("client");

  return (
    <div className="RegisterPage">

      {/* Header with Back Button */}
      <h2 className="page-header register-header">
        <Link className="back-icon" to="/home">
          <ChevronLeft size={24} strokeWidth={2} />
        </Link>
        <div className="register-header-text">
          註冊
        </div>
      </h2>

      <Box className="register-container" sx={{ maxWidth: 340 }} mx="auto">
        <div className="register-details">

          <div className="register-title">
            {identity === "client" ? <h5 className="register-text">立即登記成為我們的會員</h5> : <h5 className="register-text">立即登記成為髮型師專家</h5>}
            {/* <h2>{identity === "client" && "立即登記成為我們的會員"}</h2> */}
            {/* <h2>{identity === "stylist" && "立即登記成為髮型師專家"}</h2> */}
          </div>


          <SegmentedControl
            value={identity}
            onChange={setIdentity}
            radius={20}
            color="retro-red"
            transitionDuration={700}
            transitionTimingFunction="linear"
            className="register-segment"
            data={[
              { label: "我想剪頭髮", value: "client" },
              { label: "我喺髮型師", value: "stylist" },
            ]}
          />

          <div className="register-question">現有用戶？ 立即<Link className="link" to="/login">登入</Link>!</div>

          <div className="register-form">
            {identity === "client" ?
              <RegisterClient /> :
              <RegisterHairstylist />
            }
          </div>

        </div>
      </Box>
    </div>
  );
}
