import { ICardPreView, IEvents, ISuccessActions } from "../../types";
import { CardCatalogView } from './CardCatalogView';
import { ensureElement } from '../../utils/utils';


export class CardPreView extends CardCatalogView<ICardPreView> {
  protected _description: HTMLElement;
  protected _buyButton: HTMLButtonElement;

  constructor (container: HTMLElement, events: IEvents, actions?: ISuccessActions) {
    super(container, events);
  
  this._description = ensureElement<HTMLElement>('.card__text', this.container);
  this._buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

  this._buyButton.addEventListener('click', () => {
    events.emit('card:buy', {title: this._title, price: this._price, image: this._image, category: this.category, description: this._description, id: this._id});
    if (actions?.onClick) {
        actions.onClick();
      }
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