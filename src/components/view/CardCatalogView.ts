import { CardView } from '../common/CardView';
import { IEvents, IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';


type CategoryKey = keyof typeof categoryMap;
const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

interface ISuccessActions {
    onClick: () => void;
}

interface ICardCatalogView extends Pick<IProduct, 'image' | 'category'> {}

export class CardCatalogView<T> extends CardView<T & ICardCatalogView> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor (container: HTMLElement, events: IEvents, actions?: ISuccessActions) {
    super(container, events);

    this._category = ensureElement<HTMLElement>('.card__category', this.container);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set image(image: string) {
    this._image.src = image;
  }
  
  set category(category: string) {
      this._category.textContent = category;

      for (const key in categoryMap) {
        this._category.classList.toggle(
          categoryMap[key as CategoryKey],
          key === category
        );
      }
    }

  }