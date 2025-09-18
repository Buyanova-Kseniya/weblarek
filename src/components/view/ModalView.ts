
import { View } from '../base/View';
import {ensureElement} from '../../utils/utils';
import { IEvents } from '../../types';

interface IModalData {
  content: HTMLElement;
}

export class ModalView extends View<IModalData>{
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.events = events;

    const closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this._content = ensureElement<HTMLElement>('.modal__content', this.container);

    closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('mousedown', (evt) => {
      if (evt.currentTarget) {
        if (evt.target === evt.currentTarget) {        
          this.close()
        };
      }
    });
    this._content.addEventListener('click', (event) => event.stopPropagation());
    this.handleEsc = this.handleEsc.bind(this);
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    document.addEventListener('keyup', this.handleEsc);
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this._content.innerHTML = '';
    document.removeEventListener('keyup', this.handleEsc);
    this.events.emit('modal:close');
  }

  handleEsc(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
  
  render(data: IModalData): HTMLElement {
    if (!data) return this.container;
    this.open();
    return super.render(data);
  }
}