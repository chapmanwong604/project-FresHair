import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('hair_stylist_info', table => {
    table.dropNullable('service_tag')
  })

  if (!(await knex.schema.hasTable('districts'))) {
    await knex.schema.createTable('districts', table => {
      table.increments('id')
      table.string('district', 64).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('genders'))) {
    await knex.schema.createTable('genders', table => {
      table.increments('id')
      table.string('gender', 64).notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  
  await knex.schema.dropTableIfExists('genders')
  await knex.schema.dropTableIfExists('districts')
  await knex.schema.alterTable('hair_stylist_info', table => {
    table.setNullable('service_tag')
  })
}
