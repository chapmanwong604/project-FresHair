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
  At,
  User,
  Phone,
  Key,
  Cut,
  Home,
  MapPin,
  Pencil,
} from "tabler-icons-react";
import { API_ORIGIN } from "../api";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "./ProfileOnRegisterAndSetting.css";

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

export default function RegisterHairstylist() {
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
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      gender: "",
      bio: "",
      location: "",
      district: "",
      serviceTag: [],
      image: {},
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "電郵格式不正確"),
      username: (value) => (value.length < 2 ? "姓名至少包含 2 個字母" : null),
      phone: (value) =>
        /^[A-Za-z]*$/.test(value) || value.length !== 8
          ? "電話格式不正確"
          : null,
      password: (value) =>
        value.length < 6 ? "最小長度必須相等或大於 6" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "密碼錯誤" : null,
      bio: (value) => (value.length > 31 ? "最多30字數" : null),
    },
  });
  const [selectedImage, setSelectedImage] = React.useState(null);
  const nav = useNavigate();

  function handleImageChange(e: any) {
    setSelectedImage(e.target.files[0]);
    // console.log(e.target.files[0].name);
    // console.log(selectedImage.name);
  }

  const handleSubmit = function (form: any) {
    const formData = new FormData();
    // console.log(form);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("bio", form.bio);
    formData.append("district", form.district);
    formData.append("location", form.location);
    formData.append("service_tag", form.serviceTag);
    if (selectedImage && selectedImage["name"]) {
      formData.append("profile_pic", selectedImage, selectedImage["name"]);
    }
    // console.log(form.image)
    // console.log(Object.keys(form.image).length === 0 );
    if (Object.keys(form.image).length > 0) {
      // console.log("have photo");
      for (let i = 0; i < form.image.files.length; i++) {
        formData.append("image", form.image.files[i], form.image.path[i]);
      }
    } else {
      Swal.fire("請提供作品或髮型店照片，讓客人更加了解你");
      return;
    }

    // Display the key/value pairs
    // for (const pair of Array.from(formData.entries())) {
    //   console.log(`${pair[0]}, ${pair[1]}`);
    // }
    // if (selectedImage && selectedImage["name"]) console.log(selectedImage);

    try {
      fetch(API_ORIGIN + "hairstylist-info", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            Swal.fire({
              title: "登記成功",
              // text: "",
              icon: "success",
              timer: 1500,
            });
            nav("/login");
          } else {
            Swal.fire({
              title: "登記失敗",
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

  return (
    <>
      {/* <div>現有用戶？ 立即<Link to="/login">登入</Link>!</div> */}
      <div className="RegisterHairstylist">
        <form onSubmit={form.onSubmit(handleSubmit)} className="form">
          <TextInput
            required
            label="電郵"
            placeholder="example@mail.com"
            {...form.getInputProps("email")}
            icon={<At />}
          />
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
          <PasswordInput
            label="密碼"
            placeholder="最小長度必須相等或大於 6"
            {...form.getInputProps("password")}
            required
            icon={<Key />}
          />
          <PasswordInput
            mt="sm"
            label="確認密碼"
            placeholder="再次輸入密碼"
            {...form.getInputProps("confirmPassword")}
            required
            icon={<Key />}
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

          <Dropzone
            multiple
            onDrop={(files) => {
              let filesPath = files.map((file) => file.name);
              // console.log("accepted files", files);
              // console.log(filesPath);
              form.setFieldValue("image", {
                files: files,
                path: filesPath,
              });
            }}
            // onReject={(files) => console.log("rejected files", files)}
            maxSize={3 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
          >
            {(status) => dropzoneChildren(status, theme)}
          </Dropzone>

          <label className="upload-image-box">
            <div className="upload-image-text">
              個人頭像 <span className="register-asterisk">*</span>
            </div>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="upload-image-button"
              onChange={handleImageChange}
              required
            />
          </label>

          <Group position="center" mt="xl">
            <Button color="retro-red" type="submit" radius={20}>
              登記
            </Button>
          </Group>
        </form>
      </div>
    </>
  );
}
