import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('hair_stylist_info',table => {
        table.float('rating').notNullable().alter();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('hair_stylist_info',table => {
        table.string('rating').notNullable().alter();
    })
}

