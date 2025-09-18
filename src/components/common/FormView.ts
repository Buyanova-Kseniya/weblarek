import {IEvents} from "../../types";
import {ensureElement} from "../../utils/utils";
import { View } from "../base/View";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends View<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this.events = events;

    this._submit = ensureElement<HTMLButtonElement>('[type="submit"]', this.container);
    this._errors = ensureElement<HTMLSpanElement>('.form__errors', this.container);

    this.container.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (evt: Event) => {
        evt.preventDefault();
        this.events.emit(`${this.container.name}:submit`);
        this.container.reset();
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string[]) {
    if(value) {
      this._errors.textContent = value.join(' ');
    }
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:input`, {
      field,
      value
    });
  }

  render(state: Partial<T> & IFormState) {
    const {valid, errors, ...inputs} = state;
    super.render({valid, errors});
    Object.assign(this, inputs);
    return this.container;
  }
}