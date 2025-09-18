import { IEvents } from "../../types";
import { CardCatalogView } from './CardCatalogView';
import { ensureElement } from '../../utils/utils';


export class CardPreView extends CardCatalogView {
  protected _description: HTMLElement;
  protected _buyButton: HTMLButtonElement;

  constructor (container: HTMLElement, events: IEvents) {
    super(container, events);
  
  this._description = ensureElement<HTMLElement>('.card__text', this.container);
  this._buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

  this._buyButton.addEventListener('click', () => {
    events.emit('card:buy', {id: this._id});
  });
  }
  
  set description(description: string) {
    this._description.textContent = description;
  }

  set inBasket(value: boolean) {
    if (this._buyButton) {
        this.changeDisabledState(this._buyButton, value);
        this._buyButton.textContent = ( value ? 'Уже в корзине' : 'В корзину');
    }
  }

  changeDisabledState(button: HTMLButtonElement, value: boolean) {
    if (!button.disabled) {
      button.disabled = value;
    } else {
      button.disabled = value;
    }
  }

  // render(data: Partial<ICard> | undefined): HTMLElement {
  //   if (!data) return this.container;
  //   return super.render(data);
  // }
}