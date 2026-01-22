import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Test Configuration</h1>
      <p>Production: {{ isProduction }}</p>
      <p>API URL: {{ apiUrl }}</p>
    </div>
  `
})
export class AppComponent implements OnInit {
  isProduction = environment.production;
  apiUrl = environment.apiUrl;
  
  ngOnInit() {
    console.log('Environment:', environment);
    console.log('API URL:', this.apiUrl);
  }
}