import React, { useEffect, useState } from "react";
// import "./BookingsPage.css";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Box, Button, Group, Loader, Modal, SimpleGrid, Textarea } from "@mantine/core";
import LoginRegisterPrompt from "../components/LoginRegisterPrompt";
import { login } from "../features/login/LoginSlice";
import { API_ORIGIN } from "../api";
import moment from "moment";
import { Rating } from "react-simple-star-rating";
import { useForm } from "@mantine/form";
import RatingBoxComp from "./RatingBoxComp";
export interface MyBooking {
  date: string;
  time: string;
  status: string;
  item_description: string;
  location: string;
  username: string;
  phone: number;
  id: number;
  rating: number;
}

function BookingsClient() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);
  // console.log(user);
  // console.log(isLogin);
  // console.log(error);
  const [myBooking, setMyBooking] = useState<MyBooking[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  //   const [opened, setOpened] = useState(false);

  //   const handleRating = (rate: number) => {
  //     setRatingValue(rate);
  //     console.log(ratingValue);
  //   };

  async function getMyBooking() {
    setIsDataLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}client-booking/${user?.id}`);
      const result = await res.json();
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading(false);
    }
  }

  // const handleSubmit = function (values: any) {
  //   // const formData = [ratingValue, review];
  //   console.log(values);
  //   return;
  // };

  useEffect(() => {
    const runGetMyBooking = async () => {
      // console.log(id);

      const result = await getMyBooking();

      // console.log(result);
      // console.log(result);
      setMyBooking(result);
    };
    runGetMyBooking();
  }, []);

  return (
    <div className="BookingsPage">
      {!isLogin ? (
        <LoginRegisterPrompt />
      ) : (
        <>

          <h2 className="page-header">預約詳情</h2>

          <Box sx={{ maxWidth: 340 }} mx="auto">

            {isDataLoading && (
              <>
                <Loader size="xl" color="retro-red" />
              </>
            )}

            {!isDataLoading &&
              <>
                <div className="reminder">
                  <span className="pending-text">*</span>{" "}
                  請為已完成的理髮體驗評分，
                  <div>
                    以將預約狀況轉為
                    <span className="complete-text">已完成</span>
                    ，並給予髮型師回應。
                  </div>
                </div>

                {myBooking.map((booking: any) => (
                  <RatingBoxComp booking={booking} />
                ))}
              </>
            }
          </Box>
        </>
      )}
    </div>
  );
}

export default BookingsClient;
