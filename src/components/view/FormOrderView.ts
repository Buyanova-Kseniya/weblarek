import { IEvents, payment, ICustomerData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Form } from "../common/FormView";

interface IOrderForm extends Pick<ICustomerData, 'payment' | 'address'> {}

export class FormOrderView extends Form<IOrderForm> {
  _payment: payment; 
  _address: HTMLInputElement;
  cardButton: HTMLButtonElement;
  cashButton : HTMLButtonElement;
  
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
    this._address = ensureElement<HTMLInputElement>('[name="address"]', this.container);
    
    this.cardButton.addEventListener('click', () => {
        events.emit('payment:changed', {payment: 'card'});
    })

     this.cashButton.addEventListener('click', () => {
        events.emit('payment:changed', {payment: 'cash'});
    })

  }

  set address(text: string) {
    this._address.value = text;
  }

  set payment(value: payment) {
    this._payment = value;
  
    if (this._payment === 'card') {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    }

    if (this._payment === 'cash') {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    }

    if (!this._payment) {
      this.cashButton.classList.remove('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    }
  }

}