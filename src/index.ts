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
import { SuccessView } from './components/view/Success.View';

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
const cardsContainer = new CardsContainer(ensureElement<HTMLElement>('.gallery'))
const cardBasket = new BasketView(cloneTemplate(BasketTemplate), events);
const formOrder = new FormOrderView(cloneTemplate(formOrderTemplate), events);
const formContacts = new FormContactsView(cloneTemplate(formContactsTemplate), events);
const success = new SuccessView(cloneTemplate(successTemplate), events);

const productModel = new ProductModel({}, events);
const larekApi = new LarekApi(api);

// const mokData: ICard[] = [
//         {
//             "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
//             "description": "Если планируете решать задачи в тренажёре, берите два.",
//             "image": "/5_Dots.svg",
//             "title": "+1 час в сутках",
//             "category": "софт-скил",
//             "price": 750
//         },
//         {
//             "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
//             "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
//             "image": "/Shell.svg",
//             "title": "HEX-леденец",
//             "category": "другое",
//             "price": 1450
//         },
//         {
//             "id": "b06cde61-912f-4663-9751-09956c0eed67",
//             "description": "Будет стоять над душой и не давать прокрастинировать.",
//             "image": "/Asterisk_2.svg",
//             "title": "Мамка-таймер",
//             "category": "софт-скил",
//             "price": null
//         },
//         {
//             "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
//             "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
//             "image": "/Soft_Flower.svg",
//             "title": "Фреймворк куки судьбы",
//             "category": "дополнительное",
//             "price": 2500
//         },
//         {
//             "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
//             "description": "Если орёт кот, нажмите кнопку.",
//             "image": "/mute-cat.svg",
//             "title": "Кнопка «Замьютить кота»",
//             "category": "кнопка",
//             "price": 2000
//         },
//         {
//             "id": "f3867296-45c7-4603-bd34-29cea3a061d5",
//             "description": "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
//             "image": "Pill.svg",
//             "title": "БЭМ-пилюлька",
//             "category": "другое",
//             "price": 1500
//         },
//         {
//             "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
//             "description": "Измените локацию для поиска работы.",
//             "image": "/Polygon.svg",
//             "title": "Портативный телепорт",
//             "category": "другое",
//             "price": 100000
//         },
//         {
//             "id": "6a834fb8-350a-440c-ab55-d0e9b959b6e3",
//             "description": "Даст время для изучения React, ООП и бэкенда",
//             "image": "/Butterfly.svg",
//             "title": "Микровселенная в кармане",
//             "category": "другое",
//             "price": 750
//         },
//         {
//             "id": "48e86fc0-ca99-4e13-b164-b98d65928b53",
//             "description": "Очень полезный навык для фронтендера. Без шуток.",
//             "image": "Leaf.svg",
//             "title": "UI/UX-карандаш",
//             "category": "хард-скил",
//             "price": 10000
//         },
//         {
//             "id": "90973ae5-285c-4b6f-a6d0-65d1d760b102",
//             "description": "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
//             "image": "/Mithosis.svg",
//             "title": "Бэкенд-антистресс",
//             "category": "другое",
//             "price": 1000
//         }
//     ]
    
// setTimeout( () => productModel.catalog = mokData, 100);

// получаем данные с сервера, загружаем в модель продукта

larekApi.getProductList()
  .then(roductList => {
    productModel.catalog = roductList.items;
    // productModel.catalog = mokData;
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
events.on('card:select', (data: {id: string}) => {
  const cardPreView = new CardPreView(cloneTemplate(preViewTemplate), events);
  // modal.render({ content: cardPreView.render(productModel.getCatalogItem(data.id)) });
  modal.render({ content: cardPreView.render(productModel.getCatalogItem(data.id)) });
})


//работа корзины
events.on('card:buy', (data: {id: string}) => {
  productModel.addItemBasket(data.id);
  productModel.getCatalogItem(data.id).inBasket = true;
  modal.close();
});

events.on('basket:open', () => {
  modal.render({ content: cardBasket.render() });
});

events.on('basketItem:delete', (data: {id: string} ) => {
  productModel.removeItemBasket(data.id);
  productModel.getCatalogItem(data.id).inBasket = false;
});

events.on('basket:changed', () => {
  page.counter = productModel.basket.length;
  const basketItemsArr = productModel.basket.map( (id, index) => {
    const basketItem = new BasketItemView(cloneTemplate(basketItemTemplate), events);
    basketItem.setItemCounter(index + 1);    
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

events.on('order:changed', () => {
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

events.on('contacts:changed', () => {
  formContacts.render({
    email: productModel.email,
    phone: productModel.phone,
    valid: productModel.validateContacts(), 
    errors: productModel.contactsErrors}) 
});

//делаем заказ, отправляем на сервер
events.on('contacts:submit', () => {
  productModel.checkNullItemsPost();

  larekApi.postOrder({
    payment: productModel.payment,
    email: productModel.email,
    phone: productModel.phone,
    address: productModel.address,
    total: productModel.total,
    items: productModel.basket
  })
  // .then(response => console.log(response))
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