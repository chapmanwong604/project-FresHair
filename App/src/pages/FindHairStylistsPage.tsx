import React, { useEffect, useState } from "react";
import "./FindHairStylistsPage.css";
import { AdjustmentsHorizontal } from "tabler-icons-react";
import {
  Avatar,
  Badge,
  Divider,
  Menu,
  Box,
  Button,
  MultiSelect,
  NativeSelect,
  SimpleGrid,
  Loader,
} from "@mantine/core";
import { Rating } from "react-simple-star-rating";
import { useDebouncedValue, useInputState } from "@mantine/hooks";
import { API_ORIGIN } from "../api";
import { Link } from "react-router-dom";

async function getFilterSearch() {
  try {
    const res = await fetch(`${API_ORIGIN}filter-search`);
    const result = res.json();
    return result;
  } catch (error) {
    console.log("FETCH ERROR:", error);
  }
  return;
}

async function getHairStylistInfo(district: any, services: any, gender: any) {
  try {
    const districtFilter = new URLSearchParams();
    district.forEach((district: string) => {
      districtFilter.append("district", district);
    });
    districtFilter.toString();

    const serviceFilter = new URLSearchParams();
    services.forEach((service: string) => {
      serviceFilter.append("services", service);
    });
    serviceFilter.toString();

    const genderFilter = new URLSearchParams();
    genderFilter.set("gender", gender);
    genderFilter.toString();
    // console.log(districtFilter.toString(), serviceFilter.toString(), genderFilter.toString())
    if (district || services || gender) {
      const url = `${API_ORIGIN}hairstylist-info?${districtFilter}&${serviceFilter}&${genderFilter}`;
      const res = await fetch(url);
      const result = res.json();
      return result;
    }
  } catch (error) {
    console.log("Connect to server error", error);
  }
}

function HairStylistsSearchBar() {
  const [district, setDistrict] = useInputState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [gender, setGender] = useInputState<string>("");
  const [filters, setFilters] = useState({
    gender: [],
    service: [],
    district: [],
  });
  const [hairStylistInfo, setHairStylistInfo] = useState<[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  useEffect(() => {
    const runFilterSearch = async () => {
      const result = await getFilterSearch();
      setFilters(result);
      // setGender(result.gender)
      // setService(result.service)
      // setDistrict(result.district)
    };
    runFilterSearch();
  }, []);

  useEffect(() => {
    const runGetHairStylist = async () => {
      setIsDataLoading(true);
      const result = await getHairStylistInfo(district, services, gender);
      setHairStylistInfo(result);
      // console.log(hairStylistInfo.map((hairStylist: any) => `${hairStylist.username}  ${hairStylist.gender} ${hairStylist.location}  ${hairStylist.email}  ${hairStylist.phone}  ${hairStylist.rating}  ${hairStylist.service_tag}  ${hairStylist.district}`))
      // console.log(result)
      setIsDataLoading(false);
    };
    runGetHairStylist();
  }, [district, services, gender]);

  return (
    <div className="FindHairStylistPage">
      <h2 className="page-header">搵師傅</h2>

      <Box sx={{ maxWidth: 340 }} mx="auto">
        {isDataLoading && (
          <>
            <Loader size="xl" color="retro-red" />
          </>
        )}

        {!isDataLoading && <>
          <div className="search-container">
            <Menu
              closeOnItemClick={false}
              className="menu"
              control={
                <button className="filter-button">
                  <div className="filtered-title">
                    <div className="filter-hairstylist-title">師傅篩選器</div>
                    <div>
                      <AdjustmentsHorizontal size={30} strokeWidth={1} />
                    </div>
                  </div>

                  <div className="filtered-tag-box">
                    {/* <div className="filtered-title">已篩選類別</div> */}
                    <div>
                      <div className="filtered-tag-line">
                        {gender !== "男" && gender !== "女" ? (
                          <Badge variant="filled" className="filtered-tag">
                            任何性別
                          </Badge>
                        ) : (
                          [gender].map((tag: any, i) => (
                            <Badge
                              variant="filled"
                              key={i}
                              className="filtered-tag"
                            >
                              {tag}
                            </Badge>
                          ))
                        )}
                        {district.map((tag: any, i) => (
                          <Badge
                            variant="filled"
                            key={i}
                            className="filtered-tag"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="filtered-tag-line">
                        {services.map((tag: any, i) => (
                          <Badge
                            variant="filled"
                            key={i}
                            className="filtered-tag"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              }
              position={"bottom"}
              placement={"center"}
              withArrow
              size={"xl"}
            >
              <Menu.Label>分類</Menu.Label>
              {/* <Menu.Item icon={<AdjustmentsHorizontal size={14} />}> */}
              <MultiSelect
                // Getting Hair Stylist Info:
                data={filters.district.map((item: any) => item.district)}
                label="揀個你想剪頭髮嘅地區"
                placeholder="地區"
                searchable
                nothingFound="揾唔到你要嘅嘢"
                maxSelectedValues={2}
                value={district}
                onChange={setDistrict}
              />
              {/* </Menu.Item> */}
              {/* <Menu.Item icon={<MessageCircle size={14} />}> */}
              <Divider />
              <MultiSelect
                data={filters.service.map((item: any) => item.tag)}
                label="揀個你想要嘅服務"
                placeholder="服務"
                searchable
                nothingFound="揾唔到你要嘅嘢"
                maxSelectedValues={2}
                value={services}
                onChange={(value) => {
                  // console.log(value)
                  setServices(value);
                }}
              />
              {/* </Menu.Item> */}
              {/* <Menu.Item icon={<Photo size={14} />}> */}
              <Divider />
              <NativeSelect
                data={["任何性別"].concat(
                  filters.gender.map((item: any) => item.gender)
                )}
                label="你希望揾男／女髮型師？"
                placeholder="髮型師性別"
                value={gender}
                onChange={setGender}
              />
              {/* </Menu.Item> */}
            </Menu>
          </div>

          {hairStylistInfo &&
            hairStylistInfo.map((hairStylist: any) => (
              <SimpleGrid cols={1} className="grid" key={hairStylist.email}>
                <div className="find-hairstylist-box">
                  <div className="avatar-and-tag-box">
                    <div className="avatar">
                      <Avatar
                        src={`${API_ORIGIN}` + hairStylist.profile_pic}
                        radius="xl"
                        size="lg"
                        alt="No Icon"
                      ></Avatar>
                    </div>
                    {hairStylist.service_tag.map((tag: any, i: number) => (
                      <Badge variant="filled" key={i} className="tag">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid-data-container">
                    <div className="grid-data">暱稱: {hairStylist.username}</div>
                    <div className="grid-data">性別: {hairStylist.gender}</div>
                    <div className="grid-data">地區: {hairStylist.district}</div>
                    {/* <div className="grid-data">ID: {hairStylist.id}</div> */}
                    {/* <div className="grid-data">地址: {hairStylist.location}</div> */}
                    <div className="grid-data">簡介: {hairStylist.bio}</div>
                    {/* <div className="grid-data">Email: {hairStylist.email}</div> */}
                    {/* <div className="grid-data">電話: {hairStylist.phone}</div> */}
                    <div className="grid-data">
                      <Rating
                        size={20}
                        ratingValue={0}
                        initialValue={hairStylist.rating}
                        readonly={true}
                        allowHalfIcon={true}
                        fillColor="rgb(46, 150, 191)" /* Available Props */
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Link to={`/hair-stylist-details/${hairStylist.id}`}>
                    <Button className="booking-button">預約 及 詳細資料</Button>
                  </Link>
                </div>
              </SimpleGrid>
            ))}
        </>}
      </Box>
    </div>
  );
}

function FindHairStylistsPage() {
  return <HairStylistsSearchBar />;
}

export default FindHairStylistsPage;
