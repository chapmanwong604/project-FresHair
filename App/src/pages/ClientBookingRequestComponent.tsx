import "./ClientBookingRequsetComponent.css";
import {
  SimpleGrid,
  Textarea,
  Button,
  Avatar,
  Blockquote,
  Box,
  Chips,
  Chip,
  useMantineTheme,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useState, useEffect } from "react";
import "dayjs/locale/de";
import dayjs from "dayjs";
import { API_ORIGIN } from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { format } from "path";
import { useForm } from "@mantine/form";
import Swal from "sweetalert2";
import { ChevronLeft } from "tabler-icons-react";
import { Rating } from "react-simple-star-rating";
// import { useNavigate } from "react-router-dom";

export default function BookingRequestComponent() {
  const nav = useNavigate();
  const { user, isLogin, error } = useAppSelector((state) => state.user);
  if (!isLogin) {
    nav("/home");
  }
  const theme = useMantineTheme();
  const token = localStorage.getItem("token");
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString("en-CA")
  );
  const [plan, setPlan] = useState<string>("");
  const [selectTime, setSelectTime] = useState("");
  const [message, setMessage] = useState("");
  const [timeSlotResult, SetTimeSlotResult] = useState([
    { date: "", time: "", available: "" },
  ]);
  const [hairStylistInfo, setHairStylistInfo] = useState([
    {
      username: "",
      email: "",
      gender: "",
      profile_pic: "",
      bio: "",
      location: "",
      service_tag: [],
      image: [],
      rating: 0,
      district: "",
      item_description: "",
      item_time: 0,
      price: 0,
      hair_stylist_info_id: 0,
      plan_id: 0,
    },
  ]);


  const form = useForm({
    initialValues: {},
  });
  let { id } = useParams();


  async function postBookingRequest(values: any) {
    // console.log("VALUES",values);
    if (values.plan_id == "") {
      Swal.fire({
        title: "預約失敗",
        text: "請選擇你需要嘅服務",
        icon: "error",
      });
    }
    if (values.time == "") {
      Swal.fire({
        title: "預約失敗",
        text: "請選擇預約時間",
        icon: "error",
      });
    }

    fetch(API_ORIGIN + "client-submit-booking", {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())

      .then((json) => {
        // console.log("JSON MSG",json.msg);
        if (json.success == false) {
          Swal.fire({
            title: "預約失敗",
            text: "此時段未開放或已被預約，請預約其他時段",
            icon: "error",
          });
        }
        if (json.success) {
          Swal.fire({
            title: "成功提交預約",
            text: "如師傅確認預約後，你將會收到確認電郵通知。",
            icon: "success",
            // timer: 1500,
          });

          nav("/bookings/")

        } else {
          if (json.msg.includes("invalid input syntax for type time:")) {
            json.msg = "請選擇預約時間";
          }
          if (json.msg.includes("invalid input syntax for type integer:")) {
            json.msg = "請選擇你需要嘅服務";
          }
          if (json.msg.includes('null value in column "plan_id"')) {
            json.msg = "請選擇你需要嘅服務";
          } else {
            Swal.fire({
              title: "預約失敗",
              text: json.msg,
              icon: "error",
            });
          }
        }
      });
  }

  async function getHairStylistInfo() {
    try {
      const res = await fetch(`${API_ORIGIN}hairstylist-info/${id}`);

      const result = await res.json();
      // console.log(result);

      return result;
    } catch (error) {
      Swal.fire({
        title: "伺服器錯誤 ",
        text: "無法取得髮型師檔案",
        icon: "error",
      });
      // console.log(error);
    }
  }

  async function getTimeSlotAvailability() {
    try {
      const res = await fetch(`${API_ORIGIN}get-time-slot/${id}/${date}`);

      const result = await res.json();
      // console.log("TIME SLOT FETCHED FROM SERVER:", result);

      return result;
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: "伺服器錯誤 ",
        text: "無法取得時間表",
        icon: "error",
      });
      return;
    }
  }

  useEffect(() => {
    const runGetHairStylist = async () => {
      // console.log(id);
      const result = await getHairStylistInfo();
      setHairStylistInfo(result);
    };
    runGetHairStylist();
  }, []);

  useEffect(() => {
    const gettingTimeSlot = async () => {
      const TimeSlotResultFromFetch = await getTimeSlotAvailability();
      // console.log("ONCHANGE:", TimeSlotResultFromFetch);
      SetTimeSlotResult(TimeSlotResultFromFetch);
    };
    gettingTimeSlot();
  }, [date]);
  return (
    <>
      <div className="ClientBookingRequestComponent">
        <h2 className="page-header register-header">
          <Link className="back-icon" to={`/hair-stylist-details/${id}`}>
            <ChevronLeft size={24} strokeWidth={2} />
          </Link>
          <div className="register-header-text">預約理髮服務</div>
        </h2>

        <Box sx={{ maxWidth: 340 }} mx="auto">

          <div className="hair-stylist-details-grid">
            <div className="hair-stylist-details-title">
              師傅資料
            </div>
            <SimpleGrid>
              <div className="avatar-info-box">
                <Avatar
                  src={`${API_ORIGIN}` + hairStylistInfo[0].profile_pic}
                  size="xl"
                  alt="No Icon"
                ></Avatar>
                <div className="name-box">
                  <div>暱稱: {hairStylistInfo[0].username}</div>
                  <div>性別: {hairStylistInfo[0].gender}</div>
                  <div className="grid-data">
                    {/* 評價:{" "} */}
                    <Rating
                      size={20}
                      ratingValue={0}
                      initialValue={hairStylistInfo[0].rating}
                      readonly={true}
                      allowHalfIcon={true}
                      fillColor="rgb(46, 150, 191)" /* Available Props */
                    />
                  </div>
                </div>
              </div>
              {/* <Blockquote color="blue" cite={hairStylistInfo[0].username}>
            {hairStylistInfo[0].bio}
          </Blockquote> */}
              <div className="location-container">
                <div className="location-box">
                  <div className="grid-item">地區:</div>
                  <div className="data-item">{hairStylistInfo[0].district}</div>
                </div>
                <div className="location-box">
                  <div className="grid-item">地點:</div>
                  <div className="data-item">{hairStylistInfo[0].location}</div>
                </div>
              </div>
            </SimpleGrid>
          </div>
          <div className="instruction">
            <div className="instruction-text">只需簡單幾步</div>
            <div className="instruction-text">快速預約你嘅師傅</div>
          </div>

          <form
            onSubmit={form.onSubmit(() =>
              postBookingRequest({
                client_id: user?.id,
                hair_Stylist_info_id: id,
                date: date,
                time: selectTime,
                plan_id: plan,
                rating: hairStylistInfo[0].rating,
                special_request: message,
                status: "待確認",
                token: token,
              })
            )}
          >
            <div className="outer-grid">
              <div className="stepBox">
                <h5 className="steps-text">第1步：㨂你想要嘅服務</h5>
              </div>
              <SimpleGrid cols={1} spacing="xs">
                {hairStylistInfo.map((element) => element.plan_id)[0] === null &&
                  <>
                    <div>
                      呢位師傅暫時未有推出服務。
                    </div>
                    <div>
                      試下搵其他師傅啦！
                    </div>
                  </>

                }
                <Chips
                  styles={{
                    checked: { color: "white" },
                    checkIcon: { color: "white" },
                  }}
                  color="retro-red"
                  multiple={false}
                  value={plan}
                  onChange={setPlan}
                  position="center"
                  size="sm"
                  variant="filled"
                >
                  {hairStylistInfo.map(
                    (element, i: number) =>
                      element.plan_id && (
                        <Chip
                          className="planChips"
                          value={element.plan_id}
                          key={i}
                          variant="outline"
                          size="sm"
                        >
                          {element.item_description}&nbsp;&nbsp;&nbsp;&nbsp;
                          {element.item_time}分鐘&nbsp;&nbsp;&nbsp;&nbsp; ${" "}
                          {element.price}
                        </Chip>
                      )
                  )}
                </Chips>
              </SimpleGrid>
            </div>
            <div className="outer-grid">
              <div className="stepBox">
                <h5 className="steps-text">第2步：㨂你想預約嘅日期</h5>
              </div>
              <SimpleGrid className="calendar" cols={1}>
                <Calendar
                  value={new Date(date)}
                  onChange={async (value: any) => {
                    setDate(value.toLocaleDateString("en-CA"));
                    setSelectTime("");
                  }}
                  minDate={dayjs(new Date()).toDate()}
                  allowLevelChange={false}
                />
              </SimpleGrid>
            </div>
            <div className="outer-grid">
              <div className="stepBox">
                <h5 className="steps-text">第3步：㨂你想預約嘅時間</h5>
              </div>
              <SimpleGrid cols={1}>
                {timeSlotResult[0] == undefined && (
                  <div>無曬位啦！試下其他日子啦！</div>
                )}
                <Chips
                  styles={{
                    checked: { color: "white" },
                    checkIcon: { color: "white" },
                  }}
                  color="retro-red"
                  size="xs"
                  position="center"
                  align="center"
                  spacing="xl"
                  value={selectTime}
                  multiple={false}
                  onChange={setSelectTime}
                  variant="filled"
                >
                  {timeSlotResult.map((element, i: number) => (
                    <Chip
                      key={i}
                      value={element.time}
                      disabled={Boolean(!element.available)}
                      variant="outline"
                    >
                      {element.time.substring(0, 5)}
                    </Chip>
                  ))}
                </Chips>
              </SimpleGrid>
            </div>

            <div className="stepBox">
              <div className="reminder"><span className="note-asterisk">* </span>備註（如有）：</div>
            </div>
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              placeholder="喺呢度填寫您想同師傅講嘅野"
              label=""
            />
            <Button className="confirmButton" color="retro-red" type="submit">
              預約師傅
            </Button>

            {/* <div>Date in State:{[date, typeof date]}</div>
          <div>Plan in State:{[plan, typeof plan]}</div>
          <div>Selected time in State : {[selectTime, typeof selectTime]}</div>
          <div>Message in Stage:{[message, typeof message]}</div> */}
          </form>
        </Box>
      </div>
    </>
  );
}
