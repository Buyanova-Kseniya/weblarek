import { View } from "../base/View";
import { ICard, IEvents } from "../../types";
import { ensureElement } from '../../utils/utils';



export class CardView extends View<ICard> {
  protected _id: string;
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor (container: HTMLElement, protected events: IEvents ) {
      super(container);
      this.events = events;
      
      this._title = ensureElement<HTMLElement>('.card__title', this.container);
      this._price = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set id(id: string) {
    this._id = id;
  }

  set title(title: string) {
      this._title.textContent = title;
    }

  set price(price: number) {
      this._price.textContent = String(price);

      if (price === null) {
      this._price.textContent = 'бесценно';
    }
  }
}