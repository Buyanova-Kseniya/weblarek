export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  url: string;
  cdn: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  title: string;
}

export interface ICard {
  id: string;
  inBasket?: boolean;
  category: string;
  title: string;
  description: string;
  image: string;
  price: number | null;
}

export type EventName = string | RegExp;

export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface ISuccessActions {
    onClick: () => void;
}

export type payment = "card" | "cash" | null;

export interface IInputFormData {
  address: string;
  email: string;
  phone: string;
}