import express from 'express';
import { HairStylistInfoController } from './hairstylist-info.controller';
import { HairStylistInfoService } from './hairstylist-info.service';
import { ClientInfoController } from './client-info.controller';
import { ClientInfoService } from './client-info.service';
import { FilterSearchController } from './filter-search.controller';
import { FilterSearchService } from './filter-search.service';
import { UserController } from '../User/UserController';
import { UserService } from '../User/UserService'
import { knex } from '../db'
import { isLoggedInClient, isLoggedInStylist } from '../User/Password_JWT/guard';
import { ServicePlanService } from './service-plan.service';
import { ServicePlanController } from './service-plan.controller';
import { TimeTableService } from './timetable.service';
import { TimeTableController } from './timetable.controller';
import { ClientBookingService } from './client-getbooking.service';
import { ClientBookingController } from './client-getbooking.controller';
import { HairStylistBookingService } from './hairstylist-getbooking.service';
import { HairStylistBookingController } from './hairstylist-getbooking.controller';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';


export const routes = express.Router();

// Prepare the Services and Controllers

// services
let hairStylistInfoService = new HairStylistInfoService(knex);
let clientInfoService = new ClientInfoService(knex);
let filterSearchService = new FilterSearchService(knex);
let userService = new UserService(knex);
let servicePlanService = new ServicePlanService(knex);
let timeTableService = new TimeTableService(knex);
let timeSlotService = new TimeSlotService(knex);
let clientBookingService = new ClientBookingService(knex);
let hairstylistBookingService = new HairStylistBookingService(knex);
let bookingService = new BookingService(knex);


// controllers
let hairStylistInfoController = new HairStylistInfoController(hairStylistInfoService);
let clientInfoController = new ClientInfoController(clientInfoService);
let filterSearchController = new FilterSearchController(filterSearchService)
let userController = new UserController(userService);
let servicePlanController = new ServicePlanController(servicePlanService)
let timeTableController = new TimeTableController(timeTableService)
let timeSlotController = new TimeSlotController(timeSlotService);
let clientBookingController = new ClientBookingController(clientBookingService)
let hairStylistBookingController = new HairStylistBookingController(hairstylistBookingService)
let bookingController = new BookingController(bookingService);

// hair stylist info routes
routes.get('/hairstylist-info', hairStylistInfoController.get);
routes.post('/hairstylist-info', hairStylistInfoController.post);
routes.get('/hairstylist-info/:id', hairStylistInfoController.getFullDetails);
routes.patch('/hairstylist-info', hairStylistInfoController.patch);
routes.post('/login', userController.post)
routes.get('/hairstylist-info-by-rating',hairStylistInfoController.getDetailsByRating);

// client info routes
routes.post('/client-info', clientInfoController.post);
routes.get('/client-info/:id', clientInfoController.get);
routes.patch('/client-info', clientInfoController.patch);



// filter search routes
routes.get('/filter-search', filterSearchController.get)

// service plan routes
routes.post('/service-plan', servicePlanController.post)
routes.get('/service-plan/:id', servicePlanController.get)
routes.patch('/service-plan', servicePlanController.patch)

// timetable routes
routes.post('/timetable', timeTableController.addTimeSlot)

//GetTimeSlot routes
routes.get('/get-time-slot/:id/:date', timeSlotController.get)
routes.patch('/get-time-slot/:id/:date/:time/:available',timeSlotController.patch)

//booking routes
routes.get('/client-booking/:id', clientBookingController.get)
routes.get('/hairstylist-booking/:id', hairStylistBookingController.get)
routes.patch('/hairstylist-confirm-booking/:bookingId/:userId/:date/:time/:itemTime', hairStylistBookingController.confirm)
routes.patch('/hairstylist-reject-booking/:id', hairStylistBookingController.reject)
routes.get('/hairstylist-info-today-booking/:id',hairStylistBookingController.getTodayBooking)


routes.patch('/client-booking', clientBookingController.patch)

routes.post('/client-submit-booking', bookingController.post)
routes.get('/client-upcoming-booking/:id',clientBookingController.getUpComingBooking)
