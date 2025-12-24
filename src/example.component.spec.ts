import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it } from 'node:test';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleComponent],
    });
    const fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

    describe('add', () => {
  expect(component.add(3, 4)).toBe(7);
  expect(component.add(5, 3)).toBe(8);
  expect(component.add(-3, -2)).toBe(-1);
  expect(component.add(0, 5)).toBe(5);
  expect(component.add(5, 0)).toBe(5);
  expect(component.add(-2, -1)).toBe(-1);
  expect(component.add(-1, -2)).toBe(-2);
});

    describe('greet', () => {
  it('greets with capitalized name', () => {
    expect(component.greet('john')).toBe('Hello, John');
  });});

    describe('factorial', () => {
  it('component.factorial(0)', () => {
    expect(component.factorial(0)).toBe(1);
  });});

    describe('max', () => {
  it('returns maximum number', () => {
    expect(component.max([3, 7, 2, 9, 1])).toBe(9);
  });});

    describe('isEven', () => {
  it('returns true for even number', () => {
    expect(component.isEven(5)).toBe(true);
  });});
});
