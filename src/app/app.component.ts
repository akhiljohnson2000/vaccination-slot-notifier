import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = "qwefqwef";
  spinner = false;
  now: number;
  slotFinderStatus: boolean = true;
  setIntervalForApiCall;
  vaccineSlotsArray: Array<object> = [];
  formName: FormGroup;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    setInterval(() => {
      this.now = Date.now();
    }, 1);
  }

  ngOnInit() {
    this.formName = this.fb.group({
      pincode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$')]]
    });
  }

  formSubmit(formData) {
    console.log(formData)
    clearInterval(this.setIntervalForApiCall)
    if (formData.valid) {
      this.vaccineSlotsArray = []
      this.slotFinderStatusChange(formData);
      this.setIntervalForApiCall = setInterval(() => {
        this.slotFinderStatusChange(formData)
      }, 5000)
    } else {
      clearInterval(this.setIntervalForApiCall)
    }
  }

  slotFinderStatusChange(formData) {
    this.spinner = true;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var liveDate = dd + '-' + mm + '-' + yyyy;
    var apiparam = {
      date: liveDate,
      pincode: formData.value.pincode
    }

    this.dataService.sendGetRequest(apiparam).subscribe((data: any[]) => {
      this.spinner = false;
      data['centers'].forEach(center => {
        center.time = this.now;
        center.max45CountD1 = 0;
        center.max45CountD2 = 0;
        center.max18CountD1 = 0;
        center.max18CountD2 = 0;

        center.sessions.forEach(date => {
          if (date.min_age_limit == 45){
            center.max45CountD1 = center.max45CountD1 + date.available_capacity_dose1;
            center.max45CountD2 = center.max45CountD2 + date.available_capacity_dose2;
          }
          if (date.min_age_limit == 18){
            center.max18CountD1 = center.max18CountD1 + date.available_capacity_dose1;
            center.max18CountD2 = center.max18CountD2 + date.available_capacity_dose2;
          }
        });
      });



      this.vaccineSlotsArray.push(data);

      // data['centers'][0].sessions[0].available_capacity = 1

      if (data['centers'][0]?.max18CountD1 > 0 || data['centers'][0]?.max45CountD1 > 0 ||
      data['centers'][1]?.max18CountD1 > 0 || data['centers'][1]?.max45CountD1 > 0 ||
      data['centers'][2]?.max18CountD1 > 0 || data['centers'][2]?.max45CountD1 > 0 ||
      data['centers'][3]?.max18CountD1 > 0 || data['centers'][3]?.max45CountD1 > 0 ) {
        var audio = new Audio();
        audio.src = "https://d6cp9b00-a.akamaihd.net/downloads/ringtones/files/mp3/silent-beep-1859.mp3";
        audio.load();
        audio.play();
        setTimeout(() => {
          audio.play();
          setTimeout(() => {
            audio.play();
            setTimeout(() => {
            }, 1000);
          }, 1000);
        }, 1000);
      }
    })
  }
}
