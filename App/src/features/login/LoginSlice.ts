import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { API_ORIGIN } from "../../api";

export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  role: string;
};

export interface IUserState {
  user: User | undefined;
  isLogin: boolean;
  error: string | undefined;
}


function getCurrentToken() {
  const token = window.localStorage.getItem("token");

  if (token) {
    const user: Pick<User, "id" | "role" | "username"> = jwt_decode(token);
    return {
      id: user.id,
      username: user.username,
      password: "Hidden",
      email: "",
      role: user.role,
    } as User;
  }
  else {
    return undefined;
  }
}

function checkLoginToken() {
  return !!window.localStorage.getItem("token")
}

const initialState: IUserState = {
  user: getCurrentToken(),
  isLogin: checkLoginToken(),
  error: undefined,
};

export const login = createAsyncThunk<
  User,
  Pick<User, "email" | "password" | "role">,
  {
    rejectValue: string;
    extra: {
      jwt: string | null;
    };
  }
>("@user/login", async (parameter, thunkAPI) => {
  const res = await fetch(API_ORIGIN + "login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(parameter),
  });

  const result = await res.json();

  if (result.success) {
    const token = result.token;
    window.localStorage.setItem("token", token);

    const user: Pick<User, "id" | "role" | "username"> = jwt_decode(token);
    return {
      id: user.id,
      username: user.username,
      password: "Hidden",
      email: parameter.email,
      role: parameter.role,
    } as User;
  } else {
    return thunkAPI.rejectWithValue(result.msg);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state: IUserState, action) => {
      state.user = undefined;
      state.isLogin = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        login.fulfilled,
        (state: IUserState, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isLogin = true;
          state.error = undefined;
        }
      )
      .addCase(
        login.rejected,
        (state: IUserState, action: PayloadAction<string | undefined>) => {
          state.user = undefined;
          state.isLogin = false;
          state.error = action.payload;
          if (state.error?.includes("username")) {
            state.error = "帳戶或密碼錯誤";
          }
          Swal.fire({
            title: "登入失敗",
            text: state.error,
            icon: "error",
          });
        }
      );
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
