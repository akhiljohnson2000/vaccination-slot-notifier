import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

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
       pincode: ['',[
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
      data['centers'][0].time = this.now;
      this.vaccineSlotsArray.push(data);

      data['centers'][0].sessions[0].available_capacity = 1

      if (data['centers'][0].sessions[0].available_capacity > 0 || data['centers'][0].sessions[0].available_capacity > 0) {
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
