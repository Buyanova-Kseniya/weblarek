import { IEvents, IProduct } from "../../types";
import { CardCatalogView } from './CardCatalogView';
import { ensureElement } from '../../utils/utils';

interface ICardPreView extends Pick<IProduct, 'description'> {
  inBasket: boolean;
  isNull: number | null;
}

export class CardPreView extends CardCatalogView<ICardPreView> {
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

  set isNull(value: number | null) {
    if (value === null) {
      this._buyButton.disabled = true;
    }
  }
  
  changeDisabledState(button: HTMLButtonElement, value: boolean) {
    if (!button.disabled) {
      button.disabled = value;
    } else {
      button.disabled = value;
    }
  }

}