# Проектная работа: «Веб-ларек»
**Стек технологий:** HTML, SCSS, TypeScript, Webpack

## Структура проекта
```
src/                    # Исходные файлы проекта
├── components/         # JavaScript-компоненты
│   └── base/          # Базовые абстрактные классы
├── pages/
│   └── index.html     # HTML главной страницы
├── types/
│   └── index.ts       # Файл с типами данных
├── scss/
│   └── styles.scss    # Корневой файл стилей
├── utils/
│   ├── constants.ts   # Константы приложения
│   └── utils.ts       # Вспомогательные утилиты
└── index.ts           # Точка входа (Презентер)
```

## Установка и запуск
```bash
# Установка зависимостей
npm install
# или
yarn

# Запуск development-сервера
npm run start
# или
yarn start
```

## Сборка проекта
```bash
npm run build
# или
yarn build
```

## Модели данных

**Данные товара (IProduct):**
```typescript
interface IProduct {
  id: string;
  title: string;
  price: number | null;
  image: string;
  category: string;
  description: string;
}
```

**Данные покупателя (ICustomerData):**
```typescript
interface ICustomerData extends IInputFormData {
  payment: payment; // Способ оплаты
}

interface IInputFormData {
  address: string;
  email: string;
  phone: string;
}
```

**Данные заказа (IOrder):**
```typescript
interface IOrder extends ICustomerData {
  items: string[];   // Массив ID товаров
  total: number;     // Итоговая стоимость
}
```

## Архитектура приложения
Проект построен по парадигме **MVP (Model-View-Presenter)**:
- **Model (Модель):** Управляет данными и бизнес-логикой.
- **View (Представление):** Отвечает за отображение данных и пользовательский интерфейс.
- **Presenter (Презентер):** Координирует взаимодействие между Моделью и Представлением, используя событийный брокер для обмена сообщениями между независимыми слоями.

### Базовые классы (src/components/base/)

**Класс `Api`**
Инкапсулирует логику HTTP-запросов.
- **Конструктор:** `(baseUrl: string, headers?: HeadersInit)`
- **Методы:**
  - `get(endpoint: string): Promise<T>` — GET-запрос, возвращает ответ сервера.
  - `post(endpoint: string, data: object, method: string = 'POST'): Promise<T>` — Отправляет данные (JSON) на сервер.

**Класс `EventEmitter`**
Реализует паттерн Наблюдатель (брокер событий) для связи между компонентами.
- **Интерфейс `IEvents`:**
  - `on(event: string, callback: Function)` — Подписка на событие.
  - `emit(event: string, data?: any)` — Инициация события.
  - `trigger(event: string)` — Возвращает функцию-инициатор для указанного события.

**Абстрактный класс `Model<T>`**
Базовый класс для всех моделей данных.
- **Конструктор:** `(data: Partial<T>, protected events: IEvents)`
- Наполняет экземпляр данными типа `T` и предоставляет доступ к брокеру событий.

**Абстрактный класс `View<T>`**
Базовый класс для всех компонентов представления.
- **Поле:** `container: HTMLElement` — Контейнер для отрисовки.
- **Метод:** `render(data?: Partial<T>): HTMLElement` — Обновляет и возвращает представление на основе переданных данных.

## Слой данных (Model)

**Класс `ProductModel`**
Центральная модель, управляющая состоянием приложения: каталогом, корзиной, заказом и валидацией.
- **Конструктор:** `(events: IEvents)`
- **Поля:**
  - `_catalog: IProduct[]` — Массив товаров.
  - `_basket: string[]` — Массив ID товаров в корзине.
  - `order: ICustomerData` — Данные покупателя и способ оплаты.
  - `formOrderErrors: FormErrors` — Ошибки валидации формы заказа.
  - `formContactsErrors: FormErrors` — Ошибки валидации формы контактов.
- **Геттеры/Сеттеры/Методы:**
  - `catalog`, `basket`, `total` (стоимость корзины), `payment`, `address`, `email`, `phone`.
  - `getCatalogItem(id)`, `isBasketItem(id)`, `addItemBasket(id)`, `removeItemBasket(id)`.
  - `validateOrder()`, `orderErrors()`, `contactsErrors()`, `reset()`.

**Класс `LarekApi`**
Обеспечивает взаимодействие с сервером. Наследуется от `Api`.
- **Конструктор:** `(baseApi: Api)`
- **Методы:**
  - `getProductList(): Promise<ApiListResponse<IProduct>>` — Запрашивает список товаров, обрабатывает URL изображений.
  - `postOrder(order: IOrder): Promise<ApiOrderResponse>` — Отправляет данные заказа.

## Слой представления (View)

Все классы представления наследуются от `View<T>` и принимают в конструкторе `(container: HTMLElement, events: IEvents)`.

**`ModalView`**
Управляет модальным окном: открытием, закрытием (по крестику, клику вне окна или клавише Esc) и вставкой контента.
- **Методы:** `open()`, `close()`, `set content(value: HTMLElement)`.

**`PageView`**
Управляет основными элементами страницы: счетчиком корзины, блокировкой прокрутки и кнопкой открытия корзины.
- **Сеттеры:** `counter(value: number)`, `locked(value: boolean)`.

**`CardsContainer`**
Контейнер для отображения каталога карточек товаров.
- **Сеттер:** `catalog(items: HTMLElement[])` — Заменяет содержимое на переданный массив элементов.

**`CardView<T & ICard>` (Абстрактный)**
Базовый класс для карточек. Отображает `id`, `title`, `price`.
- **Сеттеры:** `id(id: string)`, `title(title: string)`, `price(price: number | null)`.

**`CardCatalogView<T>`**
Отображает карточку товара в каталоге. Наследуется от `CardView`. Добавляет изображение и категорию (с присвоением соответствующего CSS-класса).
- **Конструктор:** `(container, events, onClick?: () => void)`
- **Сеттеры:** `image(src: string)`, `category(category: string)`.

**`CardPreviewView`**
Отображает карточку товара в модальном окне предпросмотра. Наследуется от `CardCatalogView`. Добавляет описание и кнопку "В корзину".
- **Сеттеры:** `description(text: string)`, `inBasket(value: boolean)`, `isNull(value: number | null)`.

**`BasketItemView`**
Отображает товар в корзине. Наследуется от `CardView`. Добавляет порядковый номер и кнопку удаления, которая генерирует событие `basketItem:delete`.
- **Сеттер:** `itemCounter(index: number)`.

**`BasketView`**
Отображает корзину: список товаров, итоговую сумму и кнопку оформления заказа.
- **Сеттеры:**
  - `items(items: HTMLElement[])` — Обновляет список. Блокирует кнопку, если корзина пуста.
  - `total(sum: number)` — Устанавливает итоговую сумму.

**`Form<T>` (Абстрактный)**
Базовый класс для форм. Управляет кнопкой отправки, валидацией и отображением ошибок.
- **Поля:** `_submit: HTMLButtonElement`, `_errors: HTMLElement`.
- **Сеттеры:** `valid(value: boolean)`, `errors(value: string[])`.
- **Метод:** `onInputChange(field: keyof T, value: string)` — Генерирует событие ввода для поля.

**`FormOrderView`**
Форма заказа: выбор способа оплаты (`card`/`cash`) и ввод адреса. Наследуется от `Form<T>`.
- **Сеттеры:** `address(value: string)`, `payment(method: 'card' | 'cash')`.
- При клике на кнопку оплаты генерирует событие `payment:changed`.

**`FormContactsView`**
Форма контактов: ввод email и телефона. Наследуется от `Form<T>`.
- **Сеттеры:** `email(value: string)`, `phone(value: string)`.

**`SuccessView`**
Сообщение об успешном оформлении заказа с итоговой суммой.
- **Сеттер:** `description(total: number)` — Устанавливает текст с суммой.
- При клике на кнопку генерирует событие `order:success`.

## Слой презентера (Presenter)

Взаимодействие между компонентами организовано через **событийную шину** (`EventEmitter`). Основная логика связывания находится в файле `src/index.ts`.

**Принцип работы:**
1.  Презентер создает экземпляры Модели, Представлений и подписывается на события.
2.  Пользователь взаимодействует с интерфейсом (View), что приводит к генерации события (например, `card:buy`).
3.  Презентер перехватывает это событие и вызывает соответствующий метод Модели (например, `addItemBasket`).
4.  Модель изменяет состояние и сама генерирует событие (например, `basket:changed`).
5.  Презентер перехватывает событие от Модели и командует Представлению обновиться (например, обновить счетчик корзины).

**Основные события:**
-   **От Представления (Пользовательский ввод):** `card:select`, `card:buy`, `basket:open`, `basketItem:delete`, `order:open`, `order:submit`, `payment:changed`, `contacts:submit`, `modal:close`.
-   **От Модели (Изменение состояния):** `catalogItems:changed`, `basket:changed`, `orderInput:changed`, `contactsInput:changed`.
-   **Системные события:** `modal:open`, `order:success`.

**Пример цепочки событий:**
1.  Пользователь жмет кнопку "В корзину" в `CardPreviewView`.
2.  `CardPreviewView` генерирует событие: `events.emit('card:buy', { id: '123' })`.
3.  Презентер обрабатывает это:
    ```typescript
    events.on('card:buy', (data: { id: string }) => {
        productModel.addItemBasket(data.id); // Модель меняет состояние
        modal.close(); // Презентер управляет представлением
    });
    ```
4.  Модель `productModel` добавляет товар в корзину и генерирует событие `basket:changed`.
5.  Презентер, подписанный на `basket:changed`, обновляет UI корзины и счетчик.
    ```typescript
    events.on('basket:changed', () => {
        page.counter = productModel.basket.length;
    });
    ```