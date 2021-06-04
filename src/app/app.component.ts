import { Component, VERSION } from '@angular/core';
import { DataService } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  
  now: number;
  pincode : number;
  slotFinderStatus: boolean = true;
  setIntervalForApiCall;
  vaccineSlotsArray: Array<object> = [];
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  constructor(private dataService: DataService) {
    this.slotFinderStatusChange("wcv");
    setInterval(() => {
      this.now = Date.now();
    }, 1);
  }

  slotFinderStatusChange(event) {
    if (this.pincode && this.pincode.toString().length == 6) {
      this.setIntervalForApiCall = setInterval(() => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var liveDate = dd+'-'+mm+'-'+yyyy;

        
        var apiparam = {
          date: liveDate,
          pincode : this.pincode
        }
        this.dataService.sendGetRequest(apiparam).subscribe((data: any[]) => {
          data['centers'][0].time = this.now;
          this.vaccineSlotsArray.push(data)
          console.log(data);
          // data['centers'][0].sessions[0].available_capacity  = 1
          if (data['centers'][0].sessions[0].available_capacity > 0 || data['centers'][0].sessions[0].available_capacity > 0) {
            var audio = new Audio();
            audio.src = "https://d6cp9b00-a.akamaihd.net/downloads/ringtones/files/mp3/silent-beep-1859.mp3";
            audio.load();
            setTimeout(() => {
              audio.play();
              setTimeout(() => {
                audio.play();
                setTimeout(() => {
                  audio.play();
                }, 1000);
              }, 1000);
            }, 1000);
          }
        })
      }, 5000)
    } else {
      clearInterval(this.setIntervalForApiCall)
    }
  }
}
