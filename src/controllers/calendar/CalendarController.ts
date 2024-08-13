

import { PrismaClient } from '@prisma/client';
import { errorResponse, sucessResponse } from '../../interfaces/ResponseInterFace';





const prisma = new PrismaClient()


class CalendarController {


    public constructor() {
    }


    public async update(req: any, response: any) {

        const { arabic_date, english_date, hijreeMarabic_month_name } = req.body;

        // Validate user input
        if (!(arabic_date && english_date && hijreeMarabic_month_name)) {
            return response.status(400).send(errorResponse("All Input required", "All Input required"));
        }

        if (isNaN(Date.parse(english_date)  )||isNaN(Date.parse(arabic_date)  )) {
            return response.status(400).send(errorResponse( "date is not valid", "date is not valid"));

        }


        try {

            const calendar = await prisma.calendar.create({
                data: {
                    english_date: new Date(english_date),
                    arabic_date:new Date(arabic_date),
                    hijreeMarabic_month_name: hijreeMarabic_month_name
                }
            });

            return response.send(

                sucessResponse("data sucess", null)
            );


        } catch (error) {
            console.error(error)
            return response.status(400).send(errorResponse("catch error", error));
        }

    }

    public async getCalendar(req: any, response: any) {


        try {
            const calendar = await prisma.calendar.findMany({
                orderBy: {
                    id: 'desc',
                },
                take: 1,
            })
            if (calendar == null) {
                return response.send(errorResponse("No data found", "No data found"));

            }
            return response.send(sucessResponse("data sucess", calendar));
        } catch (error) {

            return response.status(400).send(errorResponse("catch error", error));
        }

    }




}

export default CalendarController;
