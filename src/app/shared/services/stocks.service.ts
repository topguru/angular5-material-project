import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable, Subject } from 'rxjs/Rx';

import { environment } from '../../../environments/environment.prod';

import { HttpInterceptor } from "../../shared/services/http-interceptor"
import { AuthService } from '../../shared/services/auth.service';
import { NotificationsService } from 'angular2-notifications';

import { Stock } from '../../shared/models/stock.model';

import { HeadersService } from '../../shared/services/headers.service';

@Injectable()
export class StocksService {

	stocks: Stock[];
	error_message: string;
	constructor(
		public http: HttpInterceptor,
		public auth: AuthService,
		private notificationsService: NotificationsService,
		private headersService: HeadersService
	) { }

	public getList(): Observable<Stock[]> {
		let url = environment.apiUrl+"/stocks";
		let options = this.headersService.getWithAuth();
		return this.http.get(url,options).map((response: any) => {
			this.stocks = <Stock[]>response.json().stocks;
			return this.stocks;
		}).catch((error: any) => this.handleError(error));
	}

	public create(name:string): Observable<any> {
		let url = environment.apiUrl + "/stocks/" + name;
		let options = this.headersService.postJSONWithAuth();
		return this.http.post(url, {}, options).map((response: any) => {
			let model = <any>response.json();
			return {id: model.ModelId, name: model.ModelName, variables: model.Variables, data: name};
		}).catch((error: any) => this.handleError(error));
	}

	private handleError(error: any): Observable<any> {
		var type_error  = error.status.toString()[0];
		this.error_message = type_error != 5 ? error._body : environment.msgErrors.server;
		this.notificationsService.error(
			'&nbsp;',
			this.error_message,
			{
				timeOut: 3000,
				pauseOnHover: false,
				clickToClose: false,
			}
		);
		return Observable.throw(new Error(error.status));
	}

}
