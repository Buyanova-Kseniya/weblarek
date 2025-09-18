import {IApi, IProduct, ICustomerData} from '../types';

export type ApiListResponse<Type> = {
  items: Type[];
  total: number;
};

interface ApiOrderResponse extends Pick<IOrder, 'total'>, Pick<IProduct, 'id'> {}

interface IOrder extends ICustomerData {
  items: string[];
  total: number;
}

export class LarekApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProductList(): Promise<ApiListResponse<IProduct>> {
    return this._baseApi.get<ApiListResponse<IProduct>>('/product/')
      .then(data => ({ 
        ...data, 
        items: data.items.map(item => ({ ...item, image: this._baseApi.cdn + item.image.replace('.svg', '.png') })) 
      }));
  }

  postOrder(orderData: IOrder): Promise<ApiOrderResponse> {
      return this._baseApi.post<ApiOrderResponse>('/order', orderData, 'POST')
  }
}