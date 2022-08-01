import React, { useEffect, useState } from "react";
import "./SettingsPage.css";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Accordion, Box, Button, SimpleGrid, ThemeIcon } from "@mantine/core";
import LoginRegisterPrompt from "../components/LoginRegisterPrompt";
import { login, logout } from "../features/login/LoginSlice";
import ServicePlanNewPage from "../components/ServicePlanNew";
import ClientSettingComp from "../components/ClientSettingComp";
import HairstylistProfileSetting from "../components/HairstylistProfileSetting";
import { ListDetails, Logout, User } from "tabler-icons-react";
import ServicePlanUpdatePage from "../components/ServicePlanUpdate";
import { API_ORIGIN } from "../api";

function SettingsPage() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);
  const [checkPlanNumber, setCheckPlanNumber] = useState<number | null>(2);
  const dispatch = useAppDispatch();

  async function getPlanInfo() {
    try {
      const res = await fetch(`${API_ORIGIN}service-plan/${user?.id}`);
      const result = await res.json();
      // console.log(result);
      // console.log(result.length);

      if (result.length > 0) {
        setCheckPlanNumber(1);
      } else {
        setCheckPlanNumber(0);
      }
      return result;
    } catch {
      console.log("FETCH TO Service Plan ERROR", error);
    }
  }

  useEffect(() => {
    const runGetCheckPlanNumber = async () => {
      // console.log(id);
      const result = await getPlanInfo();
      // console.log(result);
      setCheckPlanNumber(result);
    };
    runGetCheckPlanNumber();
  }, []);

  return (
    <div className="SettingsPage">
      {!isLogin ? (
        <LoginRegisterPrompt />
      ) : (
        <>
          <h2 className="page-header">個人設定</h2>
          <Box sx={{ maxWidth: 340 }} mx="auto">
            <SimpleGrid cols={1}>
              {user!.role == "stylist" ? (
                <>
                  <Accordion
                    // initialItem={0}
                    disableIconRotation
                    offsetIcon={false}
                  >
                    <Accordion.Item
                      label="服務計劃"
                      icon={
                        <>
                          <ListDetails size={20} strokeWidth={1} />
                        </>
                      }
                    >
                      {checkPlanNumber == 2 ? (
                        <></>
                      ) : checkPlanNumber == 0 ? (
                        <ServicePlanNewPage />
                      ) : (
                        <ServicePlanUpdatePage />
                      )}
                    </Accordion.Item>

                    <Accordion.Item
                      label="個人資料"
                      icon={
                        <>
                          <User size={20} strokeWidth={1} />
                        </>
                      }
                    >
                      <HairstylistProfileSetting />
                    </Accordion.Item>
                    <Accordion.Item
                      label="登出"
                      icon={
                        <>
                          <Logout size={20} strokeWidth={1} />
                        </>
                      }
                    >
                      <Button
                        color="red"
                        className="logout-button"
                        onClick={() =>
                          dispatch(logout({ user: user, isLogin: isLogin }))
                        }
                      >
                        登出
                      </Button>
                    </Accordion.Item>
                  </Accordion>
                </>
              ) : (
                <>
                  <Accordion
                    // initialItem={0}
                    disableIconRotation
                    offsetIcon={false}
                  >
                    <Accordion.Item
                      label="個人資料"
                      icon={
                        <>
                          <User size={20} strokeWidth={1} />
                        </>
                      }
                    >
                      <ClientSettingComp />
                    </Accordion.Item>
                    <Accordion.Item
                      label="登出"
                      icon={
                        <>
                          <Logout size={20} strokeWidth={1} />
                        </>
                      }
                    >
                      <Button
                        color="red"
                        onClick={() =>
                          dispatch(logout({ user: user, isLogin: isLogin }))
                        }
                      >
                        登出
                      </Button>
                    </Accordion.Item>
                  </Accordion>
                </>
              )}
            </SimpleGrid>
          </Box>
        </>
      )}
    </div>
  );
}

export default SettingsPage;
