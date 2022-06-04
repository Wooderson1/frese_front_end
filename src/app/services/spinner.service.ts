import { Injectable } from '@angular/core';
import {LoadingController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  loading: any;
  isLoading: boolean = false;
  constructor(public loadingController: LoadingController) {
  }

  public async showSpinner() {
    this.isLoading = true;
    return await this.loadingController.create({
      duration: 3000,
    }).then(a => {
      a.present().then(() => {

        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  public async hideSpinner(){
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
}
