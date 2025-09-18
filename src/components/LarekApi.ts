import {IApi, ICard, payment} from '../types';

export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};

interface IOrder {
  payment: payment,
  email: string,
  phone: string,
  address: string,
  total: number,
  items: string[]
}

export class LarekApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProductList(): Promise<ApiListResponse<ICard>> {
    return this._baseApi.get<ApiListResponse<ICard>>('/product/')
      .then(data => ({ 
        ...data, 
        items: data.items.map(item => ({ ...item, image: this._baseApi.cdn + item.image.replace('.svg', '.png') })) 
      }));
  }

  postOrder(orderData: IOrder): Promise<ApiListResponse<IOrder>> {
      return this._baseApi.post<ApiListResponse<IOrder>>('/order', orderData, 'POST')
  }
}