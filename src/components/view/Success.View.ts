import { IEvents } from "../../types";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/View";

interface ISuccess {
  description: string;
}

export class SuccessView extends View<ISuccess> {
  protected _totalPriceDescription: HTMLParagraphElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.events = events;

    this._totalPriceDescription = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
    
    const buttonClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    buttonClose.addEventListener('click', () => {
      events.emit('order:success');
    })
  }

  set description(value: number) {
    this._totalPriceDescription.textContent = `Списано ${value} синапсов`;
  }
}