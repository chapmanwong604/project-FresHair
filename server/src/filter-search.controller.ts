import { Request, Response } from 'express';
import { FilterSearchService } from './filter-search.service';

export class FilterSearchController {

    constructor(private filterSearchService: FilterSearchService) { }

    get = async (req: Request, res: Response) => {
        try {
            let json = await this.filterSearchService.getFilterDetails();
            res.json(json);
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({ success: false, msg: error.message })
            }
        }
    }

}