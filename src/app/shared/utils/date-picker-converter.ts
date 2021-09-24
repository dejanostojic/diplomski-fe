import { FormGroup } from "@angular/forms";

export default class DatePickerConverter  {

    static formControlsToZuluString(formGroup: FormGroup, dateF: string, timeF?: string){
        let v = formGroup.value
        console.log(`formGroupVal: ${JSON.stringify(v)}`)
        console.log(`date: ${v[dateF]}`)
        console.log(`time: ${v[timeF]}`)
        /*
        registrationOpen":{"year":2021,"month":8,"day":5},
        "registrationOpenTime":{"hour":1,"minute":1,"second":0}
        */
        let date = v[dateF];
        let time = v[timeF];
    
    //    console.log(`selected date: ${date["year"]}-${date["month"]}-${date["day"]}`)
    //    console.log(`selected time: ${time["hour"]}:${time["minute"]}`)
       let year = date['year'];
       let month = DatePickerConverter.getZeroPrefixDateField("" + date["month"]);
       let day = DatePickerConverter.getZeroPrefixDateField("" + date["day"])
       let hour = timeF ? DatePickerConverter.getZeroPrefixDateField("" + time["hour"]) : "00";
       let minute = timeF ?  DatePickerConverter.getZeroPrefixDateField("" + time["minute"]) : "00";
       
       let zuluFormat= `${year}-${month}-${day}T${hour}:${minute}:00.00Z`
       console.log(`zulu: ${zuluFormat}`);
       return zuluFormat;
      }


      static formControlsToDate(formGroup: FormGroup, dateF: string, timeF?: string){
        return new Date(DatePickerConverter.formControlsToZuluString(formGroup, dateF, timeF));
      }


      static toPickerDate(d: Date ){
        if (d) {
        console.log("to picker date: " + d.toString())
          return {
            day : d.getDate(),
            month : d.getMonth() + 1,
            year :  d.getFullYear()
          };
        }
        return null;
      }
      
      static toPickerTime(d: Date ){
        if (d) {
          return {
            hour : d.getHours(),
            minute : d.getMinutes()
          };
        }
        return null;
      } 

    private static getZeroPrefixDateField(val: string){
        if (!val) return null;
        return ("0" + val).slice(-2);
    }
    
} 
