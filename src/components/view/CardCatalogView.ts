import { CardView } from '../common/CardView';
import { ICardCatalogView, IEvents, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';

type CategoryKey = keyof typeof categoryMap;
const categoryMap = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
    };

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

    // this.container.addEventListener('click', (evt) => {
      // this.events.emit('card:select', this);

    //   const pricelessProduct = ensureElement<HTMLElement>('.card__price', evt.currentTarget as HTMLElement);
    //   if (pricelessProduct.textContent === 'бесценно') return;
    //   console.log(pricelessProduct);

    // console.log(`Это Target: ` + evt.target);
    // console.log(`Это currentTarget: ` + evt.currentTarget);
    // console.log(`Это THIS: ` + this);
    // console.log(`Это JSON.stringify(THIS): ` + JSON.stringify(this));
    // })
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

  
  // set category(category: string) {
  //     this._category.textContent = category;
  //   }

// render(data: Partial<ICard> | undefined) {
//   if (!data) return this.container;
  // const {category, ...others} = data;

  // switch(data.category) {
  //   case ('кнопка'):
  //     this._category.classList.add('card__category_button')
  //     break;
  //   case ('хард-скил'):
  //     this._category.classList.add('card__category_hard')
  //     break;
  //   case ('софт-скил'):
  //     this._category.classList.add('card__category_soft')
  //     break;
  //   case ('другое'):
  //     this._category.classList.add('card__category_other')
  //     break;
  //   case ('дополнительное'):
  //     this._category.classList.add('card__category_additional')
  //     break;
  //   default: 
  //     throw new Error('Ошибка чтения категории товаров data.category');
  //   }

//   return super.render(data);
// }

// перегрузка 
// render(data?: Partial<ICard>): HTMLElement;
//   render(data: Partial<ICard>): HTMLElement; 

//   render(data: Partial<ICard> | undefined) {