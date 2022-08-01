import { Knex } from "knex";

export class ServicePlanService {
  constructor(private knex: Knex) {}

  async addServicePlan(
    itemDescription: string,
    itemTime: number,
    price: number,
    id: number
  ) {
    let result = await this.knex("plan").insert({
      item_description: itemDescription,
      item_time: itemTime,
      price: price,
      hair_stylist_info_id: id,
    });
    return result;
  }

  async getServicePlan(hairStylistId: number) {
    let result = await this.knex.raw(
      `SELECT * FROM plan WHERE hair_stylist_info_id=?`,
      [hairStylistId]
    );
    return result.rows;
  }

  async updateServicePlan(itemDescription:string, itemTime:string, price:number, id:number) {
    let result = await this.knex.raw(
      `UPDATE plan SET item_description =?, item_time =?, price=? WHERE id=?`,[itemDescription, itemTime, price,id]
    )
    return result.rows;
  }
}
