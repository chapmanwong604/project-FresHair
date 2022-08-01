import React from "react";
import { useForm, formList } from "@mantine/form";
import {
  TextInput,
  Group,
  ActionIcon,
  Box,
  Text,
  Button,
  Code,
  NumberInput,
  NativeSelect,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { Trash, Users } from "tabler-icons-react";
import { API_ORIGIN } from "../api";
import Swal from "sweetalert2";
import { useAppSelector } from "../hooks";

export default function ServicePlanNewPage() {
  const {user,isLogin,error} = useAppSelector(state => state.user);

  const form = useForm({
    // initialValues: {
    //   servicePlan: formList([{ service: "", price: 0, key: randomId() }]),
    // },
    initialValues: {
      servicePlan: formList([
        {
          itemDescription: "造型設計",
          itemTime: 30,
          price: 88,
          key: randomId(),
        },
        {
          itemDescription: "專業洗剪吹",
          itemTime: 60,
          price: 198,
          key: randomId(),
        },
        {
          itemDescription: "韓式電髮連電前修護",
          itemTime: 180,
          price: 688,
          key: randomId(),
        },
        {
          itemDescription: "日系染髮連洗剪造型",
          itemTime: 180,
          price: 888,
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
            data={['30', '60', '90', '120', '150', '180', '210', '240', '270', '300', '330', '360']}
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
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => form.removeListItem("servicePlan", index)}
      >
        <Trash size={20} />
      </ActionIcon>
    </Group>
  ));

  const handleSubmit = function (form: any) {
    // console.log(form)
    const formData = []
    for (let v of form.servicePlan) {
      // console.log(v.itemDescription);
      // console.log(v.itemTime);
      // console.log(v.price);
      let newItem = {
        itemDescription:"",
        itemTime:0,
        price:0,
        id:0
      }
      newItem["itemDescription"] = v.itemDescription
      newItem["itemTime"] = v.itemTime
      newItem["price"] = v.price
      newItem["id"] = user!.id
      formData.push(newItem)
    }
    // console.log(JSON.stringify(formData))
    

    
    try {
        fetch(API_ORIGIN + "service-plan", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
          .then((res) => res.json())
          .then((json) => {
            if(json.success) {
              Swal.fire({
                title: "新增成功",
                // text: "",
                icon: "success",
                timer: 1500
            })
            }
            else{
              Swal.fire({
                title: "失敗",
                text: json.error,
                icon: "error",
            })
            }
              //success message
          });
      } catch (err) {
        console.log(err);
      }
    };
  

  return (
    <div>
      <h1>立即新增理髮服務項目</h1>

      <Box sx={{ maxWidth: 500 }} mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {fields.length > 0 ? (
            <Group mb="xs">
              <Text weight={500} size="sm"sx={{ flex: 2 }}>
                服務項目
              </Text>
              <Text weight={500} size="sm" sx={{ flex: 1 }} >
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
            <Button
            color="retro-red"
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
            </Button>
            <Button color="retro-red" type="submit">確認</Button>
          </Group>
        </form>
      </Box>
    </div>
  );
}
