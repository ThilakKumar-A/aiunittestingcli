import { Component } from '@angular/core';


@Component({
  selector: 'app-example',
  template: `<div>{{ greet('Angular') }}</div>`
})
export class ExampleComponent {

  add(a: number, b: number): number {
    return a + b;
  }


  greet(name: string): string {
    return `Hello, ${name}!`;
  }

  factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  max(values: number[]): number {
    return Math.max(...values);
  }

  isEven(num: number): boolean {
    return num % 2 === 0;
  }
}
