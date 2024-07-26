
class CalendarModel {

 arabic_date:string;
  english_date:string;
  hijreeMarabic_month_name:string;
 

 

constructor( arabic_date:string,english_date: string, hijreeMarabic_month_name: string) {
   
    this.arabic_date = arabic_date;
    this.english_date = english_date;
    this.hijreeMarabic_month_name = hijreeMarabic_month_name;
}
convertToJSON() {
    return {
      
      arabic_date: this.arabic_date,
      english_date: this.english_date,
        hijreeMarabic_month_name: this.hijreeMarabic_month_name,
    
    }
}
}
export default CalendarModel;