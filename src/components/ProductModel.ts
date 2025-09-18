import { ICard, IInputFormData, payment } from '../types'
import { Model } from './base/Model';

export interface IProductModel {
  catalog: ICard[];
  basket: string[];
  total: number;
  order: IFormsData;
} 

export interface IFormsData extends IInputFormData {
  payment: payment;
}

export type FormErrors = Partial<Record<keyof IFormsData, string>>;

export class ProductModel extends Model<IProductModel> {
  protected _catalog: ICard[] = [];
  protected _basket: string[] = [];
  protected order: IFormsData = { payment: null, address: '', email: '', phone: '' };
  protected formOrderErrors: FormErrors;
  protected formContactsErrors: FormErrors;

  set catalog(items: ICard[]) {
    this._catalog = items;
    this.events.emit('catalogItems:changed');
  }

  get catalog() {
    return this._catalog;
  }

  getCatalogItem(id: string) {
    return this._catalog.find(item => item.id === id);
  }

  isBasketItem(id: string) {
    return this._basket.some(itemId => itemId === id);
  }

  get total() {
    const items = this._basket.map(id => {
      return this._catalog.filter(card => {
        return card.id === id;
        })
      })
      const total = items.flat().reduce( (acc, item) => acc + item.price, 0 );
      return total;
  }

  addItemBasket(id: string) {
    if(!this._basket.includes(id)) {
      this._basket.push(id);
      this.events.emit('basket:changed');
    }
  }

  removeItemBasket(id: string) {
    if(this._basket.includes(id)) {
      this._basket = this._basket.filter(item => item !== id);
      this.events.emit('basket:changed');
    }
  }

   resetBasket() {
    this._basket = [];
    this.events.emit('basket:changed');
  }

  get basket() {
    return this._basket;
  }
  

  get address() {
    return this.order.address;
  }

  get email() {
    return this.order.email;
  }

   get phone() {
    return this.order.phone;
  }

  get orderErrors() {
    if (this.formOrderErrors) {
      return Object.values(this.formOrderErrors);
    }
  }

   get contactsErrors() {
    if (this.formContactsErrors) {
      return Object.values(this.formContactsErrors);
    }
  }

  set payment(value: payment) {
      this.order.payment = value;
      this.events.emit('order:changed', this.order);
      if (this.validateOrder()) {
        // this.events.emit('order:ready', this.order);
      }
    }

  get payment() {
    return this.order.payment;
  }

  setOrderField(field: keyof IInputFormData, value: string) {
    this.order[field] = value;
    this.events.emit('order:changed', this.order);
    if (this.validateOrder()) {
      // this.events.emit('order:ready', this.order);
    }
  }
  
  validateOrder() {
    const errors: typeof this.formOrderErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Укажите способ оплаты. ';
    }
    if (!this.order.address) {
      errors.address = 'Укажите адрес. ';
    }
    this.formOrderErrors = errors;
    // this.events.emit('formErrors:change', this.formOrderErrors);
    return Object.keys(errors).length === 0;
  }
  
  setContactsField(field: keyof IInputFormData, value: string) {
    this.order[field] = value;
    this.events.emit('contacts:changed');
    if (this.validateOrder()) {
      // this.events.emit('order:ready', this.order);
    }
  }
  
  validateContacts(){
    const errors: typeof this.formContactsErrors = {};
    if (!this.order.email) {
      errors.email = 'Укажите почту. ';
    }
    if (!this.order.phone) {
      errors.phone = 'Укажите номер телефона. ';
    }
    this.formContactsErrors = errors;
    // this.events.emit('formErrors:change', this.formContactsErrors);
    return Object.keys(errors).length === 0;
  }
  
 
  resetOrderForm() {
    this.order.address = '';
    this.order.payment = null;
  }
  
  resetContactsForm() {
    this.order.email = '';
    this.order.phone = '';
  }

  reset() {
    this.resetOrderForm();
    this.resetContactsForm();
    this._basket = [];
    this.events.emit('catalogItems:changed');
  }

  checkNullItemsPost() {
    const nullPriceItem = this._catalog.find(item => item.price === null);
    if (nullPriceItem) {
      (this._basket = this._basket.filter(id => id !== nullPriceItem.id));
    }
  }

}