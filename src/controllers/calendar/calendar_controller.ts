

import CalendarModel from "./calendar_model";
import CalendarQueries from './calendar_queries';
const calendarQueries = new CalendarQueries();
class CalendarController {


    public constructor() {
    }
   

    public async update(req: any, response: any) {

        const { arabic_date, english_date, hijreeMarabic_month_name} = req.body;

        // Validate user input
        if (!(arabic_date && english_date && hijreeMarabic_month_name)) {
            return response.status(400).send({ "status": false, "message": "All Input required" });
            
        }
       

        try {
            const calendar = await calendarQueries.updateCalendar(new CalendarModel(arabic_date,english_date, hijreeMarabic_month_name));
            return response.send({ "status": true, "data": calendar });
        } catch (error) {
         
            return response.status(400).send({ "status": false, "message": error });
        }
      
    }

    public async getCalendar(req: any, response: any) {

      
        try {
            const calendar = await calendarQueries.getCalendarQuere();
            if (calendar == null) {
                return response.send({ "status": false, "data": {} });
                
            }
            return response.send({ "status": true, "data": calendar });
        } catch (error) {
         
            return response.status(400).send({ "status": false, "message": error });
        }
      
    }

    

   
}

export default CalendarController;
