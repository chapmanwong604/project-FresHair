import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('client_info'))) {
    await knex.schema.createTable('client_info', table => {
      table.increments('id')
      table.string('username', 64).notNullable()
      table.string('password', 64).notNullable()
      table.string('email', 64).notNullable().unique()
      table.integer('phone').notNullable()
      table.string('gender', 64).notNullable()
      table.string('profile_pic', 256).nullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hair_stylist_info'))) {
    await knex.schema.createTable('hair_stylist_info', table => {
      table.increments('id')
      table.string('username', 64).notNullable()
      table.string('password', 64).notNullable()
      table.string('email', 64).notNullable().unique()
      table.integer('phone').notNullable()
      table.string('gender', 64).notNullable()
      table.string('profile_pic', 255).notNullable()
      table.string('bio', 255).notNullable()
      table.string('location', 255).notNullable()
      table.specificType('service_tag','integer ARRAY').nullable()
      table.specificType('image','text ARRAY').nullable()
      table.integer('rating').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('plan'))) {
    await knex.schema.createTable('plan', table => {
      table.increments('id')
      table.integer('hair_stylist_info_id').unsigned().notNullable().references('hair_stylist_info.id')
      table.string('item_description', 64).notNullable()
      table.integer('item_time').notNullable()
      table.integer('price').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('service_tag'))) {
    await knex.schema.createTable('service_tag', table => {
      table.increments('id')
      table.string('tag', 64).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('timeslot'))) {
    await knex.schema.createTable('timeslot', table => {
      table.increments('id')
      table.integer('hair_stylist_info_id').unsigned().notNullable().references('hair_stylist_info.id')
      table.date('date').notNullable()
      table.time('time').notNullable()
      table.boolean('available').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('booking'))) {
    await knex.schema.createTable('booking', table => {
      table.increments('id')
      table.integer('client_id').unsigned().notNullable().references('client_info.id')
      table.integer('hair_stylist_info_id').unsigned().notNullable().references('hair_stylist_info.id')
      table.string('status', 64).notNullable()
      table.date('date').notNullable()
      table.time('time').notNullable()
      table.integer('plan_id').unsigned().notNullable().references('plan.id')
      table.integer('rating').notNullable()
      table.string('review', 255).nullable()
      table.string('special_request', 255).nullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('price_range'))) {
    await knex.schema.createTable('price_range', table => {
      table.increments('id')
      table.string('description', 64).notNullable()
      table.integer('price_range').notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('price_range')
  await knex.schema.dropTableIfExists('booking')
  await knex.schema.dropTableIfExists('timeslot')
  await knex.schema.dropTableIfExists('service_tag')
  await knex.schema.dropTableIfExists('plan')
  await knex.schema.dropTableIfExists('hair_stylist_info')
  await knex.schema.dropTableIfExists('client_info')
}
