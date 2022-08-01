import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("service_tag").truncate();
    await knex("districts").truncate();
    await knex("genders").truncate();

    // Inserts seed entries
    await knex("service_tag").insert([
        { tag: "剪頭髮" },
        { tag: "電髮" },
        { tag: "頭髮護理" },
        { tag: "挑染" },
        { tag: "日系髮型" },
        { tag: "韓式髮型" },
        { tag: "駁髮" },
        { tag: "小童剪髮" },
        { tag: "Barber Shop" }
    ]);
    await knex("districts").insert([
        { district: "中西區" },
        { district: "東區" },
        { district: "南區" },
        { district: "灣仔區" },
        { district: "九龍城區" },
        { district: "觀塘區" },
        { district: "深水埗區" },
        { district: "黃大仙區" },
        { district: "油尖旺區" },
        { district: "離島區" },
        { district: "葵青區" },
        { district: "北區" },
        { district: "西貢區" },
        { district: "沙田區" },
        { district: "大埔區" },
        { district: "荃灣區" },
        { district: "屯門區" },
        { district: "元朗區" }
    ]);
    await knex("genders").insert([
        { gender: "男" },
        { gender: "女" }
    ]);
};
