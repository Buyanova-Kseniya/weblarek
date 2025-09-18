export abstract class View<T> {

  constructor (protected readonly container: HTMLElement) {
  }
  
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}