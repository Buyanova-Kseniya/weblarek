import { View } from '../base/View';
import { IEvents } from '../../types';
import { ensureElement, createElement } from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends View<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.events = events;

    this._list = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLSpanElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    
    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open', {items: this.items, total: this._total});
      });
    }

      this.items = [];
    }
        
    set items(items: HTMLElement[]) {
      if (items.length) {
        this._list.replaceChildren(...items);
        this._button.disabled = false;
      } else {
        this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста'
        }));
        this._button.disabled = true;
      }
    }
    
    set total(total: number) {
      this._total.textContent = String(total);
    }

  }