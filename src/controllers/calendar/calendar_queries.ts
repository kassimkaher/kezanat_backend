

import client from '../../credintial';
import CalendarModel from './calendar_model';

class CalendarQueries {
  constructor() { }

  public async updateCalendar(calendar: CalendarModel): Promise<boolean> {
    try {
      const result = await client.query('SELECT * FROM calendar ', []);

      if (result.rows.length === 0) {
       const update = await client.query('INSERT INTO calendar (arabic_date,english_date,hijreeMarabic_month_name) VALUES ($1, $2,$3) RETURNING *', [calendar.arabic_date, calendar.english_date, calendar.hijreeMarabic_month_name]);
     console.log(update.rows);
     return true;
      }
      const update = await client.query('update calendar set arabic_date = $1,english_date = $2,hijreeMarabic_month_name = $3', [calendar.arabic_date, calendar.english_date, calendar.hijreeMarabic_month_name]);
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async getCalendarQuere(): Promise<CalendarModel | null> {
    try {
      const result = await client.query('SELECT * FROM calendar ');

      if (result.rows.length === 0) {
      
     return null;
      }
       return result.rows[0];
    } catch (err) {
      throw err;
    }
  }
  public async crearTable(): Promise<boolean> {
    try {
       if (await this.checkTable()) {
        return true;
        
       }
      const result = await client.query('CREATE TABLE calendar (arabic_date DATE,english_date DATE,hijreeMarabic_month_name VARCHAR(255))');
      return true;
    } catch (err) {
      throw err;
    }
  }
  
  
public async dropTable(): Promise<boolean> {
    try {
      const result = await client.query('DROP TABLE calendar');
      return true;
    } catch (err) {
      return true;
    }
  }


  public async checkTable(): Promise<boolean> {
    try {
      const result = await client.query('SELECT * FROM calendar ');
      return true;
    } catch (err) {
      return false;
    }
  }
  
}
export default CalendarQueries;