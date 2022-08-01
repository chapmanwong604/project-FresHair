import React, { useEffect, useState } from "react";
import "../pages/BookingsPage.css";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Box, Button, SimpleGrid, Loader } from "@mantine/core";
import LoginRegisterPrompt from "./LoginRegisterPrompt";
import { login } from "../features/login/LoginSlice";
import { API_ORIGIN } from "../api";
import moment from "moment";
import { BrandWhatsapp, Map2, Phone } from "tabler-icons-react";
import Swal from "sweetalert2";
import { render } from "@testing-library/react";

function BookingsHairStylist() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);
  const [bookingNumber, setBookingNumber] = useState<number | null>();
  const [available, setAvailable] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [myBooking, setMyBooking] = useState([
    {
      status: "",
      item_description: "",
      phone: 0,
      location: "",
      username: "",
    },
  ]);

  async function getMyBooking() {
    setIsDataLoading(true);

    try {
      const res = await fetch(`${API_ORIGIN}hairstylist-booking/${user?.id}`);
      const result = await res.json();
      // console.log(result.length);
      if (result.length > 0) {
        setBookingNumber(1);
      } else {
        setBookingNumber(0);
      }
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading(false);
    }
  }

  async function confirmBooking(
    bookingID: number,
    userID: number,
    date: string,
    time: string,
    itemTime: number
  ) {
    try {
      const res = await fetch(
        `${API_ORIGIN}hairstylist-confirm-booking/${bookingID}/${userID}/${date}/${time}/${itemTime}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (result.success === false) {
        Swal.fire({
          title: "確認失敗",
          text: "未能接受，此時段未被開放或已有預約。",
          icon: "error",
          timer: 1500,
        });
      } else if (result.success === true) {
        Swal.fire({
          title: "確認成功",
          text: "已接受此預約",
          icon: "success",
          timer: 1500,
        });
      }
      setAvailable(available === true ? false : true);
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectBooking(bookingID: number) {
    Swal.fire({
      title: "是否決定要取消此預約?",
      showDenyButton: true,
      confirmButtonText: "拒絕預約",
      denyButtonText: `返回`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${API_ORIGIN}hairstylist-reject-booking/${bookingID}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const result = await res.json();
          if (result.success === true) {
            Swal.fire({
              title: "確認成功",
              text: "已拒絕此預約",
              icon: "success",
              timer: 1500,
            });
          }
          setAvailable(available === true ? false : true);
        } catch (error) {
          console.log(error);
        }
      } else if (result.isDenied) {
        Swal.fire("此預約繼續保留", "", "info");
      }
    });
  }

  useEffect(() => {
    const runGetMyBooking = async () => {
      // console.log(id);
      const result = await getMyBooking();
      // console.log(result);
      setMyBooking(result);
    };
    runGetMyBooking();
  }, [available]);

  return (
    <div className="BookingsPage">
      <h2 className="page-header">預約詳情</h2>
      <Box sx={{ maxWidth: 340 }} mx="auto">
        {!isLogin ? (
          <LoginRegisterPrompt />
        ) : (
          <>
            {isDataLoading && (
              <>
                <Loader size="xl" color="retro-red" />
              </>
            )}

            {!isDataLoading && (
              <>
                <div className="reminder">
                  <span className="pending-text">*</span>{" "}
                  如預約時段與更表開放時段不符，
                  <div>
                    將不能接受其<span className="accept-text">預約</span>，還請
                    <span className="reject-text">拒絕</span>。
                  </div>
                </div>

                {bookingNumber === 0 ? (
                  <div>你暫時沒有任何預約請求。</div>
                ) : (
                  <>
                    {/* {isDataLoading && (<>
                  <Loader color="retro-red" />
                </>)} */}

                    {
                      /* !isDataLoading && */ myBooking.map((booking: any) => (
                        <SimpleGrid cols={1} className="grid" key={booking.id}>
                          <div className="booking-details-box">
                            {/* <div className="grid-data-container"> */}
                            <div>
                              <div className="data-items">
                                <div className="grid-item">預約時間:</div>
                                <div className="grid-data">
                                  {moment(booking.date).format("YYYY-MM-DD")}
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                  {moment(booking.time, "HH:mm:ss").format(
                                    "HH:mm"
                                  )}
                                </div>
                              </div>
                              <div className="data-items">
                                {/* <div className="grid-data bold">預約時間:</div> */}
                              </div>
                              <div className="data-items">
                                <div className="grid-item">客人姓名:</div>
                                <div className="grid-data">
                                  {booking.username}
                                </div>
                              </div>
                              <div className="data-items">
                                <div className="grid-item">客人電話:</div>
                                <div className="grid-data">{booking.phone}</div>
                              </div>
                              <div className="data-items">
                                <div className="grid-item">預約項目:</div>
                                <div className="grid-data">
                                  {booking.item_description}
                                </div>
                              </div>
                              <div className="data-items">
                                <div className="grid-item">地點:</div>
                                <div className="grid-data">
                                  {booking.location}
                                </div>
                              </div>
                              <div className="data-items">
                                <div className="grid-item">狀況:</div>
                                {booking.status == "待確認" ? (
                                  <div className="grid-data pending-text">
                                    {booking.status}
                                  </div>
                                ) : booking.status == "已確認" ? (
                                  <div className="grid-data accept-text">
                                    {booking.status}
                                  </div>
                                ) : booking.status == "已拒絕" ? (
                                  <div className="grid-data reject-text">
                                    {booking.status}
                                  </div>
                                ) : (
                                  <div className="grid-data complete-text">
                                    {booking.status}
                                  </div>
                                )}
                              </div>
                              <div className="data-items">
                                <div className="grid-item">特別要求:</div>
                                <div className="grid-data">
                                  {!booking.special_request
                                    ? "沒有"
                                    : booking.special_request}
                                </div>
                              </div>
                            </div>
                            {/* </div> */}
                            <div className="grid-buttons-container">
                              <div className="link-container">
                                <a
                                  href={`http://wa.me/852${booking.phone}`}
                                  target="_blank"
                                >
                                  <BrandWhatsapp className="link-buttons whatsapp-button" />
                                </a>
                                <a
                                  href={`https://maps.google.com/?q=${booking.location}`}
                                  target="_blank"
                                >
                                  <Map2 className="link-buttons google-map-button" />
                                </a>
                                <a href={`tel:+852-${booking.phone}`}>
                                  <Phone className="link-buttons phone-button" />
                                </a>
                              </div>
                              {booking.status == "待確認" ? (
                                <div className="accept-reject-container">
                                  <Button
                                    color={"retro-blue"}
                                    size={"xs"}
                                    className="accept-reject-button"
                                    onClick={() => {
                                      confirmBooking(
                                        booking.id,
                                        user!.id,
                                        moment(booking.date).format(
                                          "YYYY-MM-DD"
                                        ),
                                        booking.time,
                                        booking.item_time
                                      );
                                    }}
                                  >
                                    確認
                                  </Button>
                                  <Button
                                    color={"red"}
                                    size={"xs"}
                                    className="accept-reject-button"
                                    onClick={() => rejectBooking(booking.id)}
                                  >
                                    拒絕
                                  </Button>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </SimpleGrid>
                      ))
                    }
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </div>
  );
}

export default BookingsHairStylist;
