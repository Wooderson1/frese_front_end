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

  public async showSpinner(duration= 3000) {
    this.isLoading = true;
    return await this.loadingController.create({
      duration,
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
    if(!this.loadingController) {
      return;
    }
    try {
      await this.loadingController.dismiss().then(() => console.log('dismissed'));
    }catch(e) {
    }
  }
}
