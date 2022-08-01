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
  Divider,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { API_ORIGIN } from "../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Phone, User } from "tabler-icons-react";
import "../pages/ProfileOnRegisterAndSetting.css";
import { logout } from "../features/login/LoginSlice";

export default function ClientSettingComp() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      username: "",
      phone: "",
      gender: "",
    },

    validate: {
      username: (value) => (value.length < 2 ? "姓名至少包含 2 個字母" : null),
      phone: (value) =>
        /^[A-Za-z]*$/.test(value) || value.length !== 8
          ? "電話格式不正確"
          : null,
    },
  });

  const [selectedImage, setSelectedImage] = React.useState(null);
  //   const [clientInfo, setClientInfo] = useState<ClientInfo[]>([]);

  function handleImageChange(e: any) {
    setSelectedImage(e.target.files[0]);
    // console.log(e.target.files[0].name);
    // console.log(selectedImage.name);
  }

  async function getClientInfo() {
    try {
      const res = await fetch(`${API_ORIGIN}client-info/${user?.id}`);
      const result = await res.json();
      return result;
    } catch {
      console.log("FETCH TO ClientInfo ERROR", error);
    }
  }

  useEffect(() => {
    const runGetClientInfo = async () => {
      // console.log(id);
      const result = await getClientInfo();
      // console.log(result);
      form.setFieldValue("username", result[0].username);
      form.setFieldValue("phone", result[0].phone);
      form.setFieldValue("gender", result[0].gender);
      //   setClientInfo(result);
    };
    runGetClientInfo();
  }, []);

  const handleSubmit = function (value: any) {
    const formData = [
      {
        username: value.username,
        phone: value.phone,
        gender: value.gender,
      },
      user!.id,
    ];
    try {
      //   console.log('fetching...')
      fetch(API_ORIGIN + "client-info", {
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
      <div className="ClientSettingComp">
        <form onSubmit={form.onSubmit(handleSubmit)} className="form">
          <TextInput
            required
            label="姓名"
            placeholder="Alex Lau"
            mt="sm"
            {...form.getInputProps("username")}
            icon={<User />}
          ></TextInput>
          <TextInput
            required
            label="聯絡電話"
            placeholder="9234 5678"
            mt="sm"
            {...form.getInputProps("phone")}
            icon={<Phone />}
          ></TextInput>
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
          {/* <label>
          個人頭像:
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label> */}
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
