import { useForm } from "@mantine/form";
import {
  PasswordInput,
  TextInput,
  Button,
  Box,
  Group,
  RadioGroup,
  Radio,
  SegmentedControl,
} from "@mantine/core";
import React, { useState } from "react";
import { API_ORIGIN } from "../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { At, GenderMale, Key, Phone, Photo, User } from "tabler-icons-react";
import "./ProfileOnRegisterAndSetting.css";

function LoginPage() {
  const [identity, setIdentity] = useState("client");
  return (
    <div className="ClientLogin">
      <SegmentedControl
        value={identity}
        onChange={setIdentity}
        radius={20}
        color="blue"
        transitionDuration={700}
        transitionTimingFunction="linear"
        data={[
          { label: "我想剪頭髮", value: "client" },
          { label: "我喺髮型師", value: "stylist" },
        ]}
      />
    </div>
  );
}

export default function RegisterClient() {
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      gender: "",
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
    },
  });

  const [selectedImage, setSelectedImage] = React.useState(null);

  function handleImageChange(e: any) {
    setSelectedImage(e.target.files[0]);
    // console.log(e.target.files[0].name);
    // console.log(selectedImage.name);
  }

  const nav = useNavigate();

  const handleSubmit = function (form: any) {
    const formData = new FormData();
    // console.log(form);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("gender", form.gender);
    if (selectedImage && selectedImage["name"]) {
      formData.append("profile_pic", selectedImage, selectedImage["name"]);
    }
    // Display the key/value pairs
    // for (const pair of Array.from(formData.entries())) {
    //   console.log(`${pair[0]}, ${pair[1]}`);
    // }
    // if (selectedImage && selectedImage["name"])
    //   console.log(selectedImage["name"]);

    try {
      fetch(API_ORIGIN + "client-info", {
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

          // console.log("fetch OK")
          //success message
        });
    } catch (err) {
      console.log(err);
    }
  };
  LoginPage();
  return (
    <>
      <div className="RegisterClient">
        {/* <div>現有用戶？ 立即<Link to="/login">登入</Link>!</div> */}
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
            className="gender"
            label="性別"
            {...form.getInputProps("gender")}
            required
            color="retro-red"
            
          >
              <Radio className="gender" value="男" label="男" required />
              <Radio className="gender" value="女" label="女" />
          </RadioGroup>

          <label className="upload-image-box">
            <div className="upload-image-text">
              個人頭像 <span className="register-asterisk"></span>
            </div>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="upload-image-button"
              onChange={handleImageChange}
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
