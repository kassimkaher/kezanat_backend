import express from 'express';


import CalendarController from '../controllers/calendar/CalendarController';

import { checkAuth, isAdmin, isVerify } from '../middleware/auth/AuthMiddleware';

const calendarController = new CalendarController();

const calendarRouter = express();


calendarRouter.route("/")
.get(calendarController.getCalendar)
.post(checkAuth,isVerify,isAdmin,calendarController.update);



export default calendarRouter;