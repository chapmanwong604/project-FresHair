import { Knex } from 'knex';

export class FilterSearchService {
    constructor(private knex: Knex) { }

    async getFilterDetails() {
        const gender = await this.knex(/* sql */ "genders").select("gender");

        const district = await this.knex(/* sql */ "districts").select("district");

        const service = await this.knex(/* sql */ "service_tag").select("tag");

        return { gender, district, service };
    }
}