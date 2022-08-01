import { useForm } from "@mantine/form";
import {
  PasswordInput,
  TextInput,
  Button,
  Box,
  Group,
  RadioGroup,
  Radio,
  Textarea,
  MultiSelect,
  MantineTheme,
  Text,
  useMantineTheme,
  NativeSelect,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  Upload,
  Photo,
  X,
  Icon as TablerIcon,
  Cut,
  MapPin,
  Home,
  Pencil,
  Phone,
  User,
} from "tabler-icons-react";
import { API_ORIGIN } from "../api";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import "../pages/ProfileOnRegisterAndSetting.css";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 150, pointerEvents: "none" }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={60}
    />

    <div>
      <Text size="xl" inline>
        提供作品或髮型店照片 (最多3張)
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

export default function HairstylistProfileSetting() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);

  const theme = useMantineTheme();

  const [filters, setFilters] = useState({ service: [], district: [] });

  useEffect(() => {
    async function getformdetails() {
      try {
        const res = await fetch(`${API_ORIGIN}filter-search`);
        const result = await res.json();
        return setFilters(result);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    getformdetails();
  }, []);

  const form = useForm({
    initialValues: {
      username: "",
      phone: "",
      gender: "",
      bio: "",
      location: "",
      district: "",
      serviceTag: [],
      // image: {},
    },

    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : "電郵格式不正確"),
      username: (value) => (value.length < 2 ? "姓名至少包含 2 個字母" : null),
      phone: (value) =>
        /^[A-Za-z]*$/.test(value) || value.length !== 8
          ? "電話格式不正確"
          : null,
      bio: (value) => (value.length > 31 ? "最多30字數" : null),
    },
  });
  const [selectedImage, setSelectedImage] = React.useState(null);
  // const nav = useNavigate();

  function handleImageChange(e: any) {
    setSelectedImage(e.target.files[0]);
    // console.log(e.target.files[0].name);
    // console.log(selectedImage.name);
  }

  async function getClientInfo() {
    try {
      const res = await fetch(`${API_ORIGIN}hairstylist-info/${user?.id}`);
      const result = await res.json();
      return result;
    } catch {
      console.log("FETCH TO HairStylistInfo ERROR", error);
    }
  }

  useEffect(() => {
    const runGetHairStylistInfo = async () => {
      // console.log(id);
      const result = await getClientInfo();
      // console.log(result);
      form.setFieldValue("username", result[0].username);
      form.setFieldValue("phone", result[0].phone);
      form.setFieldValue("gender", result[0].gender);
      form.setFieldValue("bio", result[0].bio);
      form.setFieldValue("location", result[0].location);
      form.setFieldValue("district", result[0].district);
      form.setFieldValue("serviceTag", result[0].service_tag);
      //   setClientInfo(result);
    };
    runGetHairStylistInfo();
  }, []);

  const handleSubmit = function (value: any) {
    const formData = [
      {
        username: value.username,
        phone: value.phone,
        gender: value.gender,
        bio: value.bio,
        location: value.location,
        district: value.district,
        service_tag: value.serviceTag,
      },
      user!.id,
    ];
    try {
      //   console.log('fetching...')
      fetch(API_ORIGIN + "hairstylist-info", {
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
              title: "更改個人資料成功",
              // text: "",
              icon: "success",
              timer: 1500,
            });
          } else {
            Swal.fire({
              title: "更改個人資料失敗",
              text: json.error,
              icon: "error",
            });
          }

          // console.log("fetch OK")
          //success message
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={form.onSubmit(handleSubmit)} className="form">
          <TextInput
            required
            label="姓名"
            placeholder="Alex Lau"
            mt="sm"
            {...form.getInputProps("username")}
            icon={<User />}
          />
          <TextInput
            required
            label="聯絡電話"
            placeholder="9234 5678"
            //   hideControls
            mt="sm"
            {...form.getInputProps("phone")}
            icon={<Phone />}
          />

          <RadioGroup
            color="retro-red"
            className="gender"
            label="性別"
            {...form.getInputProps("gender")}
            required
          >
            <Radio className="gender" value="男" label="男" required />
            <Radio className="gender" value="女" label="女" />
          </RadioGroup>
          <Textarea
            label="自我介紹"
            placeholder="最多30字數。如:本人從事理髮行業高達20年，擅長韓國空氣瀏海。"
            minRows={2}
            maxRows={3}
            required
            {...form.getInputProps("bio")}
            icon={<Pencil />}
          />
          <NativeSelect
            data={filters.district.map((item: any) => item.district)}
            placeholder="請選工作地區 如:荃灣區"
            label="提供理髮服務地區 "
            required
            {...form.getInputProps("district")}
            icon={<Home />}
          />
          <TextInput
            required
            label="提供理髮服務詳細地址"
            placeholder="如: 荃灣海盛路11號 One Midtown
          5樓 515-16室"
            //   hideControls
            mt="sm"
            {...form.getInputProps("location")}
            icon={<MapPin />}
          />
          <MultiSelect
            required
            data={filters.service.map((item: any) => item.tag)}
            label="能提供理髮服務(最多選3項標籤)"
            placeholder="最多選3項標籤"
            maxSelectedValues={3}
            {...form.getInputProps("serviceTag")}
            icon={<Cut />}
          />

          <Group position="center" mt="xl">
            <Button color="retro-red" type="submit">
              確認
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
}
