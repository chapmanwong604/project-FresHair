import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from "../src/features/login/LoginSlice"

export const store = configureStore({
  reducer: {
    user:userReducer,
  },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware(
    {
        thunk:{
            extraArgument:{
                jwt:window.localStorage.getItem("token")
            }
        }
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
