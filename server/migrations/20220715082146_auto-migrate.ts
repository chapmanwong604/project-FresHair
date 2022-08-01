import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('hair_stylist_info', table => {
    table.specificType('service_tag', "VARCHAR(64) ARRAY").notNullable().alter()
    table.dropNullable('image')
    table.string('district', 64).notNullable()
    
  })

}


export async function down(knex: Knex): Promise<void> {

  await knex.schema.alterTable('hair_stylist_info', table => {
    table.dropColumn('district')
    table.setNullable('image')
    table.specificType('service_tag', "integer ARRAY").notNullable().alter()
  })
}
