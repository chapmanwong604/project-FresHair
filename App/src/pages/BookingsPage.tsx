import React, { useState } from "react";
import "./BookingsPage.css";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Box, SimpleGrid } from "@mantine/core";
import LoginRegisterPrompt from "../components/LoginRegisterPrompt";
import { login } from "../features/login/LoginSlice";
import BookingRequestComponent from "./ClientBookingRequestComponent";
import BookingsClient from "../components/BookingsClient";
import BookingsHairStylist from "../components/BookingsHairStylist";

function BookingsPage() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);
  // console.log(user);
  // console.log(isLogin);
  // console.log(error);

  return (
    <>
      {/* <Box sx={{ maxWidth: 340 }} mx="auto"> */}
        {!isLogin ? (
          <LoginRegisterPrompt />
        ) : 
       (user!.role =="client" ?
        
          <BookingsClient/>
        : 
          <BookingsHairStylist/>
       )
    }
      {/* </Box> */}
    </>
  );
}

export default BookingsPage;
