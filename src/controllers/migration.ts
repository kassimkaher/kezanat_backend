import AuthQueries from './auth/auth_queries';
import CalendarQueries from './calendar/calendar_queries';
const calendarQueries = new CalendarQueries();
const authQueries = new AuthQueries();
class Migration {
    constructor() {
        
    }
    public async build(req: any, response: any) { 
        const {  password} = req.body;

        // Validate user input
        if (!( password)||  password!="2024@2025") {
            return response.status(401).send({ "status": false, "message": "Not authraize" });

        }
       
        
       try {
        await authQueries.dropTable();
        await authQueries.creatTable();
        await calendarQueries.dropTable();
        await  calendarQueries.crearTable();
        response.status(200).send({message:"tables created successfully"});
       }    catch (err) {   
        response.status(500).send({status: false, message:"error in creating tables",error :err});
       }

    }

    public async rebuild(req: any, response: any) {
        const {  password} = req.body;

        // Validate user input
        
        if (!( password)||  password!="2024@2025") {
            return response.status(401).send({ "status": false, "message": "Not authraize" });

        }

       try {
       await  authQueries.creatTable();
       
      await calendarQueries.crearTable();
        response.status(200).send({message:"tables update successfully"});
       }    catch (err) {   
        response.status(500).send({message:"error in update tables",error :err});
       }
    }
}
export default Migration;