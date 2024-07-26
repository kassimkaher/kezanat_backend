import express from 'express';
import AuthController from './controllers/auth/auth_controller';

import CalendarController from './controllers/calendar/calendar_controller';
import Migration from './controllers/migration';

const auth = new AuthController();
const calendarController = new CalendarController();
const migration = new Migration();
const router = express();

router.route("/register")
// .get(checkAuth,isVerify,auth.profile)
.post(auth.register);
router.route("/login")
// .get(checkAuth,isVerify,auth.profile)
.post(auth.login);
// .put(checkAuth,isVerify,auth.updateUser);
router.route("/calendar")
.get(calendarController.getCalendar)
.post(calendarController.update);

router.route("/migration")
.put(migration.rebuild)
.post(migration.build);

// router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const result = await client.query('SELECT * FROM your_table'); // Example query
//       res.send(result.rows);
//     } catch (err) {
//       next(err); // Pass the error to the global error handler
//     }
//   });
export default router;