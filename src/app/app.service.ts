import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private REST_API_SERVER = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin";

    constructor(private httpClient: HttpClient) { }

    public sendGetRequest(functionParams) {
        let params = new HttpParams().set('date', functionParams.date);
        params = params.append('pincode', functionParams.pincode);
        return this.httpClient.get(this.REST_API_SERVER, { params: params });
    }
}