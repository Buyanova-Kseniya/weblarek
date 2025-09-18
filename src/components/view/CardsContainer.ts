import { View } from "../base/View";

interface ICardsContainer {
  catalog: HTMLElement[];
}

export class CardsContainer extends View<ICardsContainer> {
  protected _catalog: HTMLElement;

  // constructor(container: HTMLElement) {
  //   super(container);
  // }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
