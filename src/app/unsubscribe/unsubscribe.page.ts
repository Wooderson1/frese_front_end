import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataServiceService} from "../services/data-service.service";

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.page.html',
  styleUrls: ['./unsubscribe.page.scss'],
})
export class UnsubscribePage implements OnInit {

  constructor(private route: ActivatedRoute, private dataService: DataServiceService) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const emailAddress = String(routeParams.get('email'));
    this.dataService.unsubscribe(emailAddress).subscribe(res => {
      console.log(res);
    })

    console.log(emailAddress)
  }

}
