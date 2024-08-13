import express from 'express';

import alkafeeRouter from './books_router';
import calendarRouter from './calendar_route';
import nahjRouter from './nahj_albalaga_router';
import quranRouter from './quran_router';
import sahefaAlsajadeaRout from './sahefa_alsajadea';
import userRouter from './user_route';
const router = express();
router.use('/auth', userRouter);
router.use('/calendar', calendarRouter);
router.use('/quran', quranRouter);
router.use('/nahj', nahjRouter);
router.use('/sahefaAlsajadea', sahefaAlsajadeaRout);
router.use('/book', alkafeeRouter);
export default router;