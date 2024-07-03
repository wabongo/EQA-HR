import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      &copy; {{ year }} <b><a href="https://equityafia.co.ke" target="_blank">Equity Afia</a></b>. All rights reserved.
    </span>
  `,
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}
