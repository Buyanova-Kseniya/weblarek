import { View } from "../base/View";

interface ICardsContainer {
  catalog: HTMLElement[];
}

export class CardsContainer extends View<ICardsContainer> {

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
