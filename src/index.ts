import './scss/styles.scss';
import { ensureElement, cloneTemplate} from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { IInputFormData, payment } from './types/index';
import { CardCatalogView } from './components/view/CardCatalogView';
import { CardPreView } from './components/view/CardPreView';
import { ProductModel } from './components/ProductModel';
import { ModalView } from './components/view/ModalView';
import { CardsContainer } from './components/view/CardsContainer';
import { PageView } from './components/view/PageView';
import { BasketView } from './components/view/BasketView';
import { BasketItemView } from './components/view/BasketItemView';
import { FormOrderView } from './components/view/FormOrderView';
import { FormContactsView } from './components/view/FormContactsView';
import { SuccessView } from './components/view/SuccessView';

const events = new EventEmitter();
const api = new Api(API_URL, CDN_URL);

// Мониторим все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const catalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const preViewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const BasketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketItemTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const formOrderTemplate = ensureElement<HTMLTemplateElement>("#order");
const formContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const page = new PageView(ensureElement<HTMLTemplateElement>(".page"), events);
const modal = new ModalView(ensureElement<HTMLDivElement>("#modal-container"), events); 
const cardsContainer = new CardsContainer(ensureElement<HTMLElement>('.gallery'));
const cardPreView = new CardPreView(cloneTemplate(preViewTemplate), events);
const cardBasket = new BasketView(cloneTemplate(BasketTemplate), events);
const formOrder = new FormOrderView(cloneTemplate(formOrderTemplate), events);
const formContacts = new FormContactsView(cloneTemplate(formContactsTemplate), events);
const success = new SuccessView(cloneTemplate(successTemplate), events);

const productModel = new ProductModel({}, events);
const larekApi = new LarekApi(api);

// получаем данные с сервера, загружаем в модель продукта
larekApi.getProductList()
  .then(roductList => {
    productModel.catalog = roductList.items;
  })
  .catch(err => {
    console.error(err);
  });

//перехватываем событие загрузки продуктовой модели и отображаем каталог товаров
events.on('catalogItems:changed', () => {
  const cardsArray = productModel.catalog.map(item => {
    const cardInstance = new CardCatalogView(cloneTemplate(catalogTemplate), events, {
      onClick: () => {
      events.emit('card:select', item);
      }
    });
    return cardInstance.render(item);
  })
  cardsContainer.render({ catalog: cardsArray })
})

//работа карточки PreView
events.on('card:select', (data: {id: string, title: string, price: number, image: string, category: string, description: string }) => {
  modal.render({ content: cardPreView.render({
    id: data.id,
    title: data.title, 
    price: data.price, 
    image: data.image, 
    category: data.category,
    description: data.description, 
    inBasket: productModel.isBasketItem(data.id),
    isNull: data.price
    }),
  });
})

//работа корзины
events.on('card:buy', (data: {id: string}) => {
  productModel.addItemBasket(data.id);
  modal.close();
});

events.on('basket:open', () => {
  modal.render({ content: cardBasket.render() });
});

events.on('basketItem:delete', (data: {id: string} ) => {
  productModel.removeItemBasket(data.id);
});

events.on('basket:changed', () => {
  page.counter = productModel.basket.length;
  
  const basketItemsArr = productModel.basket.map( (id, index) => {
    const basketItem = new BasketItemView(cloneTemplate(basketItemTemplate), events);
    basketItem.ItemCounter = index + 1;    
    return basketItem.render(productModel.getCatalogItem(id));
  });

  cardBasket.render({items: basketItemsArr, total: productModel.total});
});

//работаем с Order-формой 
events.on('order:open', () => {
  modal.render({ content: formOrder.render({
    address: productModel.address, 
    payment: productModel.payment, 
    valid: productModel.validateOrder(), 
    errors: productModel.orderErrors }) 
  });
});

events.on('payment:changed', ( data: { payment: payment }) => {
  productModel.payment = data.payment;
});

events.on('order.address:input', (data: { field: keyof IInputFormData, value: string }) => {
  productModel.setOrderField(data.field, data.value);
});

events.on('orderInput:changed', () => {
  formOrder.render({
    address: productModel.address, 
    payment: productModel.payment, 
    valid: productModel.validateOrder(), 
    errors: productModel.orderErrors }) 
});

//работаем с Contacts-формой 
events.on('order:submit', () => {
  modal.render({ content: formContacts.render({
    email: productModel.email,
    phone: productModel.phone,
    valid: productModel.validateContacts(), 
    errors: productModel.contactsErrors}) 
  });
});

events.on(/^contacts\..*:input/, (data: { field: keyof IInputFormData, value: string }) => {  
  productModel.setContactsField(data.field, data.value);
});

events.on('contactsInput:changed', () => {
  formContacts.render({
    email: productModel.email,
    phone: productModel.phone,
    valid: productModel.validateContacts(), 
    errors: productModel.contactsErrors}) 
});

//отправляем заказ на сервер
events.on('contacts:submit', () => {
  larekApi.postOrder({
    payment: productModel.payment,
    email: productModel.email,
    phone: productModel.phone,
    address: productModel.address,
    total: productModel.total,
    items: productModel.basket
  })
  .then(response => {
    modal.render({ content: success.render({description: String(response.total)}) })
    productModel.reset();
  })
  .catch(err => {
      console.error(err);
    });
});

events.on('order:success', () => {
  page.counter = 0;
  modal.close();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});