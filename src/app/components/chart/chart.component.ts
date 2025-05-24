import { Component, Input } from '@angular/core';
import { ChartType, ChartOptions, ChartDataset } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  template: `
    <div class="chart-container">
      <h3>{{ title }}</h3>
      <canvas
        baseChart
        [datasets]="datasets"
        [labels]="labels"
        [options]="options"
        [legend]="legend"
        [type]="type"
      ></canvas>
    </div>
  `,
  styles: [
    `
      .chart-container {
        width: 100%;
        padding: 1rem;
        text-align: center;
      }
    `,
  ],
})
export class AppChartComponent {
  @Input() title!: string;
  @Input() datasets!: ChartDataset[];
  @Input() labels!: string[];
  @Input() type: ChartType = 'bar';
  @Input() legend = true;
  @Input() options: ChartOptions = { responsive: true };
}
