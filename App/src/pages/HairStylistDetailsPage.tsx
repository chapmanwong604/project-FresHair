import {
  Avatar,
  Badge,
  Blockquote,
  Box,
  Button,
  SimpleGrid,
  Table,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { API_ORIGIN } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import "./HairStylistDetailsPage.css";
import { ChevronLeft } from "tabler-icons-react";

export default function HairStylistDetailsPage() {
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
      review: "",
    },
  ]);
  let { id } = useParams();

  async function getHairStylistInfo() {
    try {
      const res = await fetch(`${API_ORIGIN}hairstylist-info/${id}`);

      const result = await res.json();
      // console.log(result);

      return result;
    } catch (error) {
      console.log("FETCH TO HARIINFO ERROR", error);
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

  return (
    <div className="HairStylistDetailsPage">
      <h2 className="page-header register-header">
        <Link className="back-icon" to="/find-hair-stylists">
          <ChevronLeft size={24} strokeWidth={2} />
        </Link>
        <div className="register-header-text">師傅簡介</div>
      </h2>

      <Box sx={{ maxWidth: 340 }} mx="auto">
        <SimpleGrid cols={1}>
          <div className="outer-grid">
            <div className="hair-stylist-details-grid">
              <div className="hair-stylist-details-title">
                個人資料
              </div>
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
              <Blockquote className="quote" color="retro-blue" cite={hairStylistInfo[0].username}>
                {hairStylistInfo[0].bio}
              </Blockquote>
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
            </div>

            <div className="hair-stylist-details-grid">
              <div className="hair-stylist-plans-title">
                作品及服務概覽
              </div>
              <Carousel fade>
                {hairStylistInfo[0].image.map((image: any, i: number) => (
                  <Carousel.Item>
                    <img
                      style={{ height: "100%", width: "100%" }}
                      src={`${API_ORIGIN}` + image}
                      key={i}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>

              {/* {hairStylistInfo[0].service_tag.map((tag: any, i: number) => (
          <Badge variant="filled" key={i} className="tag">
            {tag}
          </Badge>
        ))} */}
              {/* <div>Service Plan</div> */}
              {/* {hairStylistInfo.map((element, i: number) => (
            <div key={i}>
              客人評價:
              <div>{element.review}</div>
            </div>
          ))}
          <div>{hairStylistInfo[0].review}</div> */}
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>服務項目</th>
                    <th>所需要時間</th>
                    <th>價錢</th>
                  </tr>
                </thead>
                <tbody>
                  {hairStylistInfo.map((element, i: number) => (
                    <tr key={i}>
                      <td>{element.item_description}</td>
                      <td>{element.item_time} 分鐘</td>
                      <td>$ {element.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

            </div>
          </div>
          <div className="booking">
            <Button
              className="to-booking-page-button"
              color="retro-red"
              component={Link}
              to={`/requestBooking/${id}`}
            // className="booking-button"

            >
              立即預約
            </Button>

          </div>
        </SimpleGrid>
      </Box>
    </div>
  );
}
