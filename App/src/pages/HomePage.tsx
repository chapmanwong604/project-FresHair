import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  Container,
  Box,
  ScrollArea,
  SimpleGrid,
  Badge,
  Avatar,
  Divider,
  Loader,
} from "@mantine/core";
import { Link } from "react-router-dom";
import LoginRegisterPrompt from "../components/LoginRegisterPrompt";
import { logout } from "../features/login/LoginSlice";
import { API_ORIGIN } from "../api";
import moment from "moment";
import logo from "../logo.png";
import { useInterval } from "@mantine/hooks";
import { Star } from "tabler-icons-react";

interface MyBooking {
  date: string;
  time: string;
  status: string;
  item_description: string;
  location: string;
  username: string;
  phone: number;
  id: number;
}

function HomePage() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);
  // console.log(user);
  // console.log(isLogin);
  // console.log(error);
  const [info, setInfo] = useState([]);
  const dispatch = useAppDispatch();
  const [myBooking, setMyBooking] = useState<any>();
  const [myBookingStylist, setMyBookingStylist] = useState<MyBooking[]>([]);
  const [seconds, setSeconds] = useState(0);
  const interval = useInterval(() => setSeconds((s) => s + 1), 5000);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isDataLoading2, setIsDataLoading2] = useState<boolean>(false);
  const [isDataLoading3, setIsDataLoading3] = useState<boolean>(false);


  async function getInfoByRating() {
    setIsDataLoading(true)
    try {
      const res = await fetch(`${API_ORIGIN}hairstylist-info-by-rating`);
      const result = res.json();
      return result;
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setIsDataLoading(false)
    }
    return;
  }

  async function getUpComingMyBooking() {
    setIsDataLoading2(true)
    try {
      const res = await fetch(
        `${API_ORIGIN}client-upcoming-booking/${user?.id}`
      );
      const result = await res.json();
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading2(false)
    }
  }

  async function getMyBookingStylist() {
    setIsDataLoading3(true)
    try {
      const res = await fetch(`${API_ORIGIN}hairstylist-info-today-booking/${user?.id}`);
      const result = await res.json();
      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading3(false)
    }
  }

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  useEffect(() => {
    const runGetMyBooking = async () => {
      const result = await getMyBookingStylist();
      setMyBookingStylist(result);
    };
    runGetMyBooking();
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      const result = await getInfoByRating();
      setInfo(result);
    };
    getInfo();
  }, []);

  useEffect(() => {
    const runUpComingMyBooking = async () => {
      const result = await getUpComingMyBooking();
      setMyBooking(result);

    };
    runUpComingMyBooking();
  }, []);
  console.log(myBookingStylist)
  return (
    <div className="HomePage">
      <Box className="outer-box" sx={{ maxWidth: 340 }} mx="auto">
        {!isLogin ? (
          <LoginRegisterPrompt />
        ) : (
          <div className="logged-in-page">
            <h1>FresHair</h1>

            {(isDataLoading || isDataLoading2 || isDataLoading3) && (
              <>
                <Loader size="xl" color="retro-red" />
              </>
            )}

            {!isDataLoading && !isDataLoading2 && !isDataLoading3 &&
              <>
                <SimpleGrid className="big-grid" cols={1}>
                  {/* <div className="logo-box">
                    <img src={logo} className="App-logo" alt="logo" />
                  </div> */}

                  {/* <div> */}

                  {user?.role == "stylist" && (
                    <div className="stylist-home">


                      <h4 className="homepage-text">今日預約狀況</h4>

                      {myBookingStylist.length == 0 &&
                        <div>
                          <div className="not-found-text">今日未有預約，</div>
                          <div className="not-found-text">當休息下先囉！</div>
                        </div>
                      }

                      {myBookingStylist &&

                        <div>
                          <SimpleGrid cols={1} >


                            {myBookingStylist.map((booking: any) => (
                              /* {console.log("Today:",moment().format("YYYY-MM-DD"))}
                              {console.log("Plan Date:",moment(booking.date).format("YYYY-MM-DD"))} */

                              moment(booking.date).format("YYYY-MM-DD") ===
                              moment().format("YYYY-MM-DD") && (
                                <div className="grid">
                                  <div className="grid-inner-box">

                                    <div className="grid-item bold">預約日期:</div>
                                    <div className="grid-data">{moment(booking.date).format("YYYY-MM-DD")}</div>
                                  </div>
                                  <div className="grid-inner-box">
                                    <div className="grid-item bold">預約時間:</div>
                                    <div className="grid-data">{booking.time}</div>
                                  </div>
                                  <div className="grid-inner-box">
                                    <div className="grid-item bold">客人姓名:</div>
                                    <div className="grid-data">{booking.username}</div>
                                  </div>
                                  <div className="grid-inner-box">
                                    <div className="grid-item bold">客人電話:</div>
                                    <div className="grid-data">{booking.phone}</div>
                                  </div>
                                  <div className="grid-inner-box">
                                    <div className="grid-item bold">地點:</div>
                                    <div className="grid-data">{booking.location}</div>
                                  </div>
                                  <div className="grid-inner-box">
                                    <div className="grid-item bold">預約項目:</div>
                                    <div className="grid-data">{booking.item_description}</div>
                                  </div>
                                </div>
                              )

                            ))}
                          </SimpleGrid>

                        </div>
                      }
                    </div>

                  )}


                  {user?.role == "client" && (
                    <div className="Client-Home">

                      <h4 className="homepage-text">熱門師傅</h4>

                      <SimpleGrid
                        cols={5}
                        spacing="md"
                        className="SimpleGridAvatar"
                      >
                        {info &&
                          info.map((detailInfo: any) => (
                            <Link
                              className="avatar"
                              id={detailInfo.hair_stylist_info_id}
                              to={`/hair-stylist-details/${detailInfo.hair_stylist_info_id}`}
                            >
                              <Avatar
                                // component="button"
                                className=""
                                src={`${API_ORIGIN}` + detailInfo.profile_pic}
                                radius="xl"
                                size="lg"
                                alt="No Icon"
                              ></Avatar>
                              {seconds % 3 == 0 && (
                                <Badge size="sm" className="Badge">
                                  <div className="star">
                                    <div className="star-text">
                                      <Star fill="white" size={10} color="transparent" />
                                    </div>
                                    <div className="star-text">
                                      :{detailInfo.rating}
                                    </div>

                                  </div>
                                </Badge>
                              )}
                              {seconds % 3 == 1 && (
                                <Badge size="sm" className="Badge">
                                  {detailInfo.service_tag[0]}
                                </Badge>
                              )}
                              {seconds % 3 == 2 && (
                                <Badge size="sm" className="Badge">
                                  {detailInfo.district}
                                </Badge>
                              )}
                              {console.log(seconds)}
                            </Link>
                          ))}
                      </SimpleGrid>

                      <h4 className="homepage-text">下一個已確認的預約</h4>

                      {!myBooking &&
                        <div>
                          <div className="not-found-text">暫時未有預約，</div>
                          <div className="not-found-text">快啲搵你心水嘅髮型師！</div>
                        </div>
                      }
                      {myBooking && (
                        <div className="grid">
                          <div className="grid-inner-box">
                            <div className="grid-item bold">預約日期:</div>
                            <div className="grid-data">{moment(myBooking.date).format("YYYY-MM-DD")}</div>
                          </div>
                          <div className="grid-inner-box">
                            <div className="grid-item bold">預約時間:</div>
                            <div className="grid-data">{myBooking.time}</div>
                          </div>
                          <div className="grid-inner-box">
                            <div className="grid-item bold">師傅姓名:</div>
                            <div className="grid-data">{myBooking.username}</div>
                          </div>
                          <div className="grid-inner-box">
                            <div className="grid-item bold">師傅電話:</div>
                            <div className="grid-data">{myBooking.phone}</div>
                          </div>
                          <div className="grid-inner-box">
                            <div className="grid-item bold">地點:</div>
                            <div className="grid-data">{myBooking.location}</div>
                          </div>
                          <div className="grid-inner-box">
                            <div className="grid-item bold">預約項目:</div>
                            <div className="grid-data">{myBooking.item_description}</div>
                          </div>
                        </div>
                      )}

                      {/* {myBooking &&
                      myBooking.map(
                        (bookingInfo: any) =>
                          (bookingInfo.status == "已確認" && moment(bookingInfo.date).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD")) && (
                            <div className="grid">
                              <div className="grid-data" >
                                <div className="grid-data bold">預約日期:</div>
                                {moment(bookingInfo.date).format("YYYY-MM-DD")}
                              </div>
                              <div className="grid-data"><div className="grid-data bold">預約時間:</div>{bookingInfo.time}</div>
                              <div className="grid-data"><div className="grid-data bold">預約師傅姓名:</div>{bookingInfo.username}</div>
                              <div className="grid-data"><div className="grid-data bold">地點:</div>{bookingInfo.location}</div>
                            </div>
                          )
                      )} */}
                    </div>
                  )}
                  {/* </div> */}

                </SimpleGrid>
              </>}
          </div>
        )}
      </Box>
    </div>
  );
}

export default HomePage;
