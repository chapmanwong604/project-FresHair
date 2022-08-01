import React, { useEffect } from "react";
import { useForm, formList } from "@mantine/form";
import {
  TextInput,
  Group,
  ActionIcon,
  Box,
  Text,
  Button,
  NumberInput,
  NativeSelect,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { Trash, Users } from "tabler-icons-react";
import { API_ORIGIN } from "../api";
import Swal from "sweetalert2";
import { useAppSelector } from "../hooks";

export default function ServicePlanUpdatePage() {
  const { user, isLogin, error } = useAppSelector((state) => state.user);

  const form = useForm({
    initialValues: {
      servicePlan: formList([
        {
          itemDescription: "",
          itemTime: 30,
          price: 0,
          key: randomId(),
        },
      ]),
    },
  });

  const fields = form.values.servicePlan.map((item, index) => (
    <Group key={item.key} mt="xs">
      <TextInput
        placeholder="理髮服務 如剪髮、電髮、染髮..."
        required
        sx={{ flex: 2.5 }}
        {...form.getListInputProps("servicePlan", index, "itemDescription")}
      />
      <NativeSelect
        data={[
          "30",
          "60",
          "90",
          "120",
          "150",
          "180",
          "210",
          "240",
          "270",
          "300",
          "330",
          "360",
        ]}
        // parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
        // max={300}
        sx={{ flex: 1.1 }}
        // step={30}
        // min={30}

        required
        {...form.getListInputProps("servicePlan", index, "itemTime")}
      />
      <NumberInput
        defaultValue={0}
        required
        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
        hideControls
        max={2000}
        sx={{ flex: 0.9 }}
        {...form.getListInputProps("servicePlan", index, "price")}
      />
      {/* <ActionIcon
        color="red"
        variant="hover"
        onClick={() => form.removeListItem("servicePlan", index)}
      >
        <Trash size={20} />
      </ActionIcon> */}
    </Group>
  ));

  async function getPlanInfo() {
    try {
      const res = await fetch(`${API_ORIGIN}service-plan/${user?.id}`);
      const result = await res.json();
      return result;
    } catch {
      console.log("FETCH TO Service Plan ERROR", error);
    }
  }

  useEffect(() => {
    const runGetServicePlanInfo = async () => {
      // console.log(id);
      let result: {
        itemDescription: string;
        itemTime: number;
        price: number;
        key: string;
      }[] = await getPlanInfo();
      result = result.map((item: any) => {
        return {
          itemDescription: item.item_description,
          itemTime: item.item_time,
          price: item.price,
          key: item.id,
        };
      });

      form.setFieldValue("servicePlan", formList(result));
    };
    runGetServicePlanInfo();
  }, []);

  const handleSubmit = function (form: any) {
    // console.log(form)
    const formData = [];
    for (let v of form.servicePlan) {
      // console.log(v.itemDescription);
      // console.log(v.itemTime);
      // console.log(v.price);
      let newItem = {
        itemDescription: "",
        itemTime: 0,
        price: 0,
        hairStylistId: 0,
        id: 0,
      };
      newItem["itemDescription"] = v.itemDescription;
      newItem["itemTime"] = v.itemTime;
      newItem["price"] = v.price;
      newItem["hairStylistId"] = user!.id;
      newItem["id"] = v.key;
      formData.push(newItem);
    }
    // console.log(JSON.stringify(formData));

    try {
      fetch(`${API_ORIGIN}service-plan/`, {
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
              title: "更改服務計劃成功",
              // text: "",
              icon: "success",
              timer: 1500,
            });
          } else {
            Swal.fire({
              title: "更改服務計劃失敗",
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
    <div>
      <h2>更新理髮服務計劃</h2>

      <Box sx={{ maxWidth: 340 }} mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {fields.length > 0 ? (
            <Group mb="xs">
              <Text weight={500} size="sm" sx={{ flex: 2 }}>
                服務項目
              </Text>
              <Text weight={500} size="sm" sx={{ flex: 1 }}>
                需要時間<div>(分鐘)</div>
              </Text>
              <Text weight={500} size="sm" sx={{ flex: 0.9 }} pl={8}>
                價錢
              </Text>
            </Group>
          ) : (
            <Text color="dimmed" align="center">
              快D增加服務!!
            </Text>
          )}

          {fields}

          <Group position="center" mt="md">
            {/* <Button
              onClick={() =>
                form.addListItem("servicePlan", {
                  itemDescription: "",
                  itemTime: 30,
                  price: 100,
                  key: randomId(),
                })
              }
            >
              + 增加
            </Button> */}
            <Button color="retro-red" type="submit">
              確認
            </Button>
          </Group>
        </form>

        {/* <Text size="sm" weight={500} mt="md">
          Form values:
        </Text>
        <Code block>{JSON.stringify(form.values, null, 2)}</Code> */}
      </Box>
    </div>
  );
}
