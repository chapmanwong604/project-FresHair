import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  SegmentedControl,
  Button,
  PasswordInput,
  TextInput,
  Box,
} from "@mantine/core";
import { ChevronLeft, ArrowBackUp, At, Key } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import "./LoginPage.css"
import { login } from "../features/login/LoginSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { user, isLogin, error } = useAppSelector(state => state.user);
  const [identity, setIdentity] = useState("client");
  const nav = useNavigate()
  if (isLogin) { nav("/home") }

  return (
    <div className="LoginPage">

      {/* Header with Back Button */}
      <h2 className="page-header login-header">
        <Link className="back-icon" to="/home">
          <ChevronLeft size={24} strokeWidth={2} />
        </Link>
        <div className="login-header-text">
          登入
        </div>
      </h2>

        <Box className="login-container" sx={{ maxWidth: 340 }} mx="auto">
          <div className="login-details">

            <div className="login-title">
              {identity === "client" && <h5 className="login-text">立即登入 搵髮型師幫你剪髮</h5>}
              {identity === "stylist" && <h5 className="login-text">立即登入 管理你嘅髮型師檔案</h5>}
            </div>

            <SegmentedControl
              value={identity}
              onChange={setIdentity}
              radius={20}
              transitionDuration={700}
              transitionTimingFunction="linear"
              className="login-segment"
              color="retro-blue"
              data={[
                { label: "我想剪頭髮", value: "client" },
                { label: "我喺髮型師", value: "stylist" },
              ]}
            />


            <div className="login-form">
              <LoginForm identity={identity} />
            </div>

            <div>未有帳戶？ 立即<Link className="link" to="/register">加入</Link>！</div>

          </div>
        </Box>

    </div>
  );
}

type Props = {
  identity: string
}

function LoginForm(props: Props) {
  const dispatch = useAppDispatch()
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "登入電郵格式錯誤"),
    },
  });
  // const submitHandler = (event:SyntheticEvent)=>{
  //   event.preventDefault(); 
  //   const upload:any = event.target;
  //   console.log("UPLOAD",upload);
  //   dispatch(login({email:upload.email.value,password:upload.password.value,role:props.identity})).unwrap()
  // }
  return (
    <form onSubmit={
      form.onSubmit((values) =>
        dispatch(login({ email: values.email, password: values.password, role: props.identity })).unwrap())
    }>
      <div className="LoginDiv">
        <TextInput

          styles={{
            wrapper: { color: 'retro-blue' },
            defaultVariant: { color: 'retro-blue' },
            filledVariant: { color: 'retro-blue' },
            unstyledVariant: { color: 'retro-blue' },
          }}

          icon={<At />}
          placeholder="登入電郵"
          className="login-input"
          {...form.getInputProps("email")}
          label=""
          required
        />
        <PasswordInput
          styles={{
            wrapper: { color: 'retro-blue' },
            defaultVariant: { color: 'retro-blue' },
            filledVariant: { color: 'retro-blue' },
            unstyledVariant: { color: 'retro-blue' },
          }}
          icon={<Key />}
          placeholder="登入密碼"
          className="login-input"
          {...form.getInputProps("password")}
          required
        />
        <Button color="retro-blue" type="submit" radius={20}>
          登入
        </Button>
      </div>
    </form>
  );
}

export default LoginPage;
