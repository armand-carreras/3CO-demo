import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.page.html',
  styleUrls: ['./start-screen.page.scss'],
  standalone: false,
})
export class StartScreenPage implements OnInit, ViewDidEnter {

  public progress = 0;
  public loading = false;
  public isModelLoaded = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
  }

  navigateToAuth() {
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }



}
