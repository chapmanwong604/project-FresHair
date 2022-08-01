import { Button, Group, Modal, SimpleGrid, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import moment from "moment";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import "../pages/BookingsPage.css";
import Swal from "sweetalert2";
import { BrandWhatsapp, Map2, Phone } from "tabler-icons-react";
import { API_ORIGIN } from "../api";
import { MyBooking } from "./BookingsClient";
import { useNavigate } from "react-router-dom";

export default function RatingBoxComp({ booking }: { booking: MyBooking }) {
  const [opened, setOpened] = useState(false);
  const [ratingValue, setRatingValue] = useState(100);

  const nav = useNavigate()

  // if (submit == true) {nav("/home")}

  const form = useForm({
    initialValues: {
      ratingValue: ratingValue,
      review: "",
    },

    validate: {
      review: (value) => (value.length > 31 ? "最多30字數" : null),
    },
  });

  const handleSubmit = function (value: any) {
    const formData = [
      {
        review: value.review,
        ratingValue: ratingValue,
        status: "已完成"
      },
      booking.id,
    ];
    // console.log(formData)
    try {
      fetch(API_ORIGIN + "client-booking", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            Swal.fire({
              title: "感謝你的意見!",
              // text: "",
              icon: "success",
              timer: 1500,
            });
            setOpened(false);
            nav("/home")
          } else {
            Swal.fire({
              title: "請再試!",
              text: json.error,
              icon: "error",
            });
          }
          //success message
        });
    } catch (err) {
      console.log(err);
    }
  };
  //   console.log(ratingValue)
  return (
    <>
      <SimpleGrid cols={1} className="grid" key={booking.id}>
        <div>
          <div className="booking-details-box">
            {/* <div className="grid-data-container"> */}
            <div>
              <div className="data-items">
                <div className="grid-item">預約時間:</div>
                <div className="grid-data">
                  {moment(booking.date).format("YYYY-MM-DD")}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {moment(booking.time, "HH:mm:ss").format("HH:mm")}
                </div>
              </div>
              <div className="data-items">
                {/* <div className="grid-data bold">預約時間:</div> */}
              </div>
              <div className="data-items">
                <div className="grid-item">師傅姓名:</div>
                <div className="grid-data">{booking.username}</div>
              </div>
              <div className="data-items">
                <div className="grid-item">師傅電話:</div>
                <div className="grid-data">{booking.phone}</div>
              </div>
              <div className="data-items">
                <div className="grid-item">預約項目:</div>
                <div className="grid-data">{booking.item_description}</div>
              </div>
              <div className="data-items">
                <div className="grid-item">地點:</div>
                <div className="grid-data">{booking.location}</div>
              </div>
              <div className="data-items">
                <div className="grid-item">狀況:</div>
                {booking.status == "待確認" ? (
                  <div className="grid-data pending-text">{booking.status}</div>
                ) : booking.status == "已確認" ? (
                  <div className="grid-data accept-text">{booking.status}</div>
                ) : booking.status == "已拒絕" ? (
                  <div className="grid-data reject-text">{booking.status}</div>
                ) :
                  <div className="grid-data complete-text">{booking.status}</div>}
              </div>
            </div>
            {/* </div> */}
            <div className="grid-buttons-container">
              <div className="link-container">
                <a href={`http://wa.me/852${booking.phone}`} target="_blank">
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
              {Date.now() > +new Date(booking.date) &&
                booking.status == "已確認" ? (
                booking.rating == 0 ? (
                  <Group position="center">
                    <Button
                      color={"retro-blue"}
                      onClick={() => setOpened(true)}
                    >
                      評分
                    </Button>
                  </Group>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}

              <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="請為今次理髮體驗評分"
                centered
                // overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
              >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Rating
                    onClick={(rate) => setRatingValue(rate)}
                    ratingValue={ratingValue}
                    // showTooltip
                    tooltipArray={[
                      "非常不滿意",
                      "不滿意",
                      "沒意見",
                      "滿意",
                      "非常滿意",
                    ]}
                    fillColor="rgb(46, 150, 191)"
                  // {...form.getInputProps(ratingValue)}
                  />

                  <Textarea
                    placeholder="(可選)最多30字數"
                    autosize
                    minRows={2}
                    maxRows={4}
                    {...form.getInputProps("review")}
                  />

                  <Group position="center" mt="xl">
                    <Button color={"retro-blue"} type="submit">
                      確認
                    </Button>
                  </Group>
                </form>
              </Modal>
            </div>
          </div>

          {/* <div className="grid-data">預約日期:{moment(booking.date).format("YYYY-MM-DD")}</div>
          <div className="grid-data">預約時間:{booking.time}</div>
          <div className="grid-data">預約師傅姓名:{booking.username}</div>
          <div className="grid-data">預約師傅電話:{booking.phone}</div>
          <div className="grid-data">地點:{booking.location}</div>
          <div className="grid-data">預約項目:{booking.item_description}</div>
          <div className="grid-data">預約狀況:{booking.status}</div>
          <div className="link-container">
            <a href={`http://wa.me/852${booking.phone}`} target="_blank"><BrandWhatsapp className="link-buttons whatsapp-button" /></a>
            <a href={`https://maps.google.com/?q=${booking.location}`} target="_blank"><Map2 className="link-buttons google-map-button" /></a>
            <a href={`tel:+852-${booking.phone}`}><Phone className="link-buttons phone-button" /></a>
          </div> */}
        </div>
      </SimpleGrid>
    </>
  );
}
