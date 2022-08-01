import express, { Request, Response } from "express";
import { ServicePlanService } from "./service-plan.service";

export class ServicePlanController {
  constructor(private servicePlanService: ServicePlanService) {}

  post = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (Array.isArray(body)) {
        for (let item of body) {
          const itemDescription = item.itemDescription;
          const itemTime = item.itemTime;
          const price = item.price;
          const id = item.id;
          let result = await this.servicePlanService.addServicePlan(
            itemDescription,
            itemTime,
            price,
            id
          );
          if (!result) {
            throw new Error("Cannot insert into database.");
          }
        }
        res.json({
          success: true,
        });
      } else {
        res.json({ error: "Incorrect data format" });
      }
    } catch (error) {
      res.json({ error: error });
      console.log(error);
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const hairStylistId = req.params.id;
      let json = await this.servicePlanService.getServicePlan(
        +hairStylistId
      );
      res.json(json);
    } catch (error) {
      res.json({ error: error });
    }
  }

  patch =  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (Array.isArray(body)) {
        for (let item of body) {
          const itemDescription = item.itemDescription;
          const itemTime = item.itemTime;
          const price = item.price;
          // const hairStylistId = item.hairStylistId;
          const id = item.id;
          let result = await this.servicePlanService.updateServicePlan(
            itemDescription,
            itemTime,
            price,
            // hairStylistId,
            id
          );
          if (!result) {
            throw new Error("Cannot insert into database.");
          }
        }
        res.json({
          success: true,
        });
      } else {
        res.json({ error: "Incorrect data format" });
      }
    } catch (error) {
      res.json({ error: error });
      console.log(error);
    }
  };

}
