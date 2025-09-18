import { IBasketItemView, IEvents } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CardView } from '../common/CardView';

export class BasketItemView extends CardView<IBasketItemView> {
  _itemCounter: HTMLSpanElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._itemCounter = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    const button = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
    button.addEventListener('click', () => {
      events.emit('basketItem:delete', {id: this._id});
      });
    }

    set ItemCounter(value: number) {
      value++;
      this._itemCounter.textContent = String(value -1);
    }
}