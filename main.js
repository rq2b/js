// Вы разрабатываете программное обеспечение для службы доставки еды. Система должна позволять создавать пользователей, оформлять заказы, назначать курьеров и отслеживать процесс доставки.
//
// Создайте базовый класс User, который хранит имя, номер телефона и уникальный ID.
//
// На его основе создайте два класса:
// - Customer: клиент, который может оформлять заказы и просматривать историю заказов.
// - Courier: курьер, который может принимать заказы, доставлять их и отслеживать количество выполненных доставок.
// Используйте наследование и приватные поля там, где это необходимо.
//
// Создайте классы Restaurant и Dish.
//
// Ресторан должен иметь название, меню и возможность добавлять или удалять блюда. Каждое блюдо содержит название, стоимость и категорию.
//
// Клиент должен иметь возможность просматривать меню ресторана.
//
// Создайте класс Order.
//
// Каждый заказ должен содержать клиента, ресторан, список выбранных блюд, общую стоимость и статус.
//
// Реализуйте методы добавления блюд, подсчета стоимости и изменения статуса заказа.
//
// Предусмотрите следующие статусы:
// Создан
// Готовится
// В пути
// Доставлен
//
//
// Разные способы доставки
// Создайте базовый класс Delivery, а от него два класса:
// - BikeDelivery: доставка на велосипеде, стоимость 50 грн.
// - CarDelivery: доставка автомобилем, стоимость 100 грн.
// У каждого способа доставки должен быть метод calculatePrice(), который возвращает стоимость доставки.
//
// Используйте переопределение методов, чтобы продемонстрировать полиморфизм.
//
//
// Демонстрация работы
// В конце программы необходимо создать минимум два ресторана, шесть блюд, двух клиентов и двух курьеров.
//
// Продемонстрируйте полный процесс: клиент выбирает ресторан, добавляет блюда, оформляет заказ, система рассчитывает стоимость, курьер принимает заказ и доставляет его. После доставки информация должна появиться в истории клиента, а количество доставок курьера увеличиться.


let next_user_id = 1;
let next_order_id = 1;

const OrderStatus =
{
  CREATED: "Создан",
  PREPARING: "Готовится",
  IN_DELIVERY: "В пути",
  DELIVERED: "Доставлен"
};


class User
{
  #name;
  #phone;
  #id;

  constructor(name, phone)
  {
    this.#name = name;
    this.#phone = phone;
    this.#id = next_user_id++;
  }

  getName() { return this.#name; }
  getPhone() { return this.#phone; }
  getId() { return this.#id; }

  printInfo()
  {
    console.log(`ID: ${this.#id}; Имя: ${this.#name}; Телефон: ${this.#phone}`);
  }
}


class Customer extends User
{
  #orderHistory;

  constructor(name, phone)
  {
    super(name, phone);
    this.#orderHistory = [];
  }

  viewMenu(restaurant)
  {
    if(!(restaurant instanceof Restaurant)) { console.log("Ресторан не найден"); return false; }

    console.log(`Меню ресторана "${restaurant.getName()}":`);
    for(let dish of restaurant.getMenu()) { dish.printInfo(); }
    return true;
  }

  createOrder(restaurant, delivery)
  {
    if(!(restaurant instanceof Restaurant)) { console.log("Ресторан не найден"); return null; }
    if(!(delivery instanceof Delivery)) { console.log("Способ доставки не найден"); return null; }

    return new Order(this, restaurant, delivery);
  }

  placeOrder(order)
  {
    if(!(order instanceof Order) || order.getCustomer() != this) { console.log("Невозможно оформить этот заказ"); return false; }
    if(!order.place()) { return false; }

    this.#orderHistory.push(order);
    console.log(`${this.getName()} оформил заказ #${order.getId()}`);
    return true;
  }

  getOrderHistory() { return [...this.#orderHistory]; }

  printOrderHistory()
  {
    console.log(`История заказов клиента ${this.getName()}:`);
    if(this.#orderHistory.length == 0) { console.log("Заказов пока нет"); return; }

    for(let order of this.#orderHistory) { order.printInfo(); }
  }
}


class Courier extends User
{
  #completedDeliveries;
  #currentOrder;

  constructor(name, phone)
  {
    super(name, phone);
    this.#completedDeliveries = 0;
    this.#currentOrder = null;
  }

  acceptOrder(order)
  {
    if(this.#currentOrder != null) { console.log("Курьер уже выполняет заказ"); return false; }
    if(!(order instanceof Order)) { console.log("Заказ не найден"); return false; }
    if(!order.startPreparing()) { return false; }

    this.#currentOrder = order;
    console.log(`Курьер ${this.getName()} принял заказ #${order.getId()}`);
    return true;
  }

  startDelivery()
  {
    if(this.#currentOrder == null) { console.log("У курьера нет активного заказа"); return false; }
    return this.#currentOrder.startDelivery();
  }

  completeDelivery()
  {
    if(this.#currentOrder == null) { console.log("У курьера нет активного заказа"); return false; }
    if(!this.#currentOrder.complete()) { return false; }

    this.#completedDeliveries++;
    console.log(`Курьер ${this.getName()} завершил доставку заказа #${this.#currentOrder.getId()}`);
    this.#currentOrder = null;
    return true;
  }

  getCompletedDeliveries() { return this.#completedDeliveries; }

  printInfo()
  {
    super.printInfo();
    console.log(`Выполнено доставок: ${this.#completedDeliveries}`);
  }
}


class Dish
{
  #name;
  #price;
  #category;

  constructor(name, price, category)
  {
    this.#name = name;
    this.#price = price;
    this.#category = category;
  }

  getName() { return this.#name; }
  getPrice() { return this.#price; }
  getCategory() { return this.#category; }

  printInfo()
  {
    console.log(`${this.#name}: ${this.#price} грн (${this.#category})`);
  }
}


class Restaurant
{
  #name;
  #menu;

  constructor(name)
  {
    this.#name = name;
    this.#menu = [];
  }

  getName() { return this.#name; }
  getMenu() { return [...this.#menu]; }
  hasDish(dish) { return this.#menu.includes(dish); }

  addDish(dish)
  {
    if(!(dish instanceof Dish)) { console.log("Блюдо не блюдо?!"); return false; }
    if(this.#menu.includes(dish)) { console.log("Это блюдо уже есть в меню"); return false; }

    this.#menu.push(dish);
    console.log(`Блюдо "${dish.getName()}" добавлено в меню ресторана "${this.#name}"`);
    return true;
  }

  removeDish(dish)
  {
    let index = this.#menu.indexOf(dish);
    if(index == -1) { console.log("Блюдо не найдено в меню"); return false; }

    this.#menu.splice(index, 1);
    console.log(`Блюдо "${dish.getName()}" удалено из меню ресторана "${this.#name}"`);
    return true;
  }
}


class Delivery
{
  getName() { return "Доставка"; }
  calculatePrice() { throw new Error("Метод calculatePrice() не реализован"); }
}


class BikeDelivery extends Delivery
{
  getName() { return "Велосипед"; }
  calculatePrice() { return 50; }
}


class CarDelivery extends Delivery
{
  getName() { return "А-А-АВТОМОБИЛЬ!!"; }
  calculatePrice() { return 100; }
}


class Order
{
  #id;
  #customer;
  #restaurant;
  #dishes;
  #delivery;
  #totalCost;
  #status;
  #isPlaced;

  constructor(customer, restaurant, delivery)
  {
    this.#id = next_order_id++;
    this.#customer = customer;
    this.#restaurant = restaurant;
    this.#dishes = [];
    this.#delivery = delivery;
    this.#totalCost = 0;
    this.#status = OrderStatus.CREATED;
    this.#isPlaced = false;
  }

  getId() { return this.#id; }
  getCustomer() { return this.#customer; }
  getStatus() { return this.#status; }
  getTotalCost() { return this.#totalCost; }
  getDishes() { return [...this.#dishes]; }

  addDish(dish)
  {
    if(this.#isPlaced || this.#status != OrderStatus.CREATED) { console.log("Нельзя изменить оформленый заказ"); return false; }
    if(!(dish instanceof Dish) || !this.#restaurant.hasDish(dish)) { console.log("Блюда нет в меню ресторана"); return false; }

    this.#dishes.push(dish);
    this.calculateTotal();
    return true;
  }

  calculateTotal()
  {
    let total = this.#delivery.calculatePrice();
    for(let dish of this.#dishes) { total += dish.getPrice(); }

    this.#totalCost = total;
    return this.#totalCost;
  }

  place()
  {
    if(this.#isPlaced || this.#dishes.length == 0) { console.log("Нельзя оформить пустой / оформленный заказ"); return false; }

    this.calculateTotal();
    this.#isPlaced = true;
    return true;
  }

  startPreparing()
  {
    if(!this.#isPlaced || this.#status != OrderStatus.CREATED) { console.log("Заказ нельзя принять"); return false; }

    this.#status = OrderStatus.PREPARING;
    console.log(`Заказ #${this.#id} готовится`);
    return true;
  }

  startDelivery()
  {
    if(this.#status != OrderStatus.PREPARING) { console.log("Заказ нельзя отправить"); return false; }

    this.#status = OrderStatus.IN_DELIVERY;
    console.log(`Заказ #${this.#id} в пути`);
    return true;
  }

  complete()
  {
    if(this.#status != OrderStatus.IN_DELIVERY) { console.log("Заказ нельзя завершить"); return false; }

    this.#status = OrderStatus.DELIVERED;
    console.log(`Заказ #${this.#id} доставлен`);
    return true;
  }

  printInfo()
  {
    console.log(`\nЗаказ #${this.#id}`);
    console.log(`Клиент: ${this.#customer.getName()}`);
    console.log(`Ресторан: ${this.#restaurant.getName()}`);
    console.log("Список блюд:");
    for(let dish of this.#dishes) { console.log(`- ${dish.getName()}: ${dish.getPrice()} грн`); }
    console.log(`Доставка: ${this.#delivery.getName()}: ${this.#delivery.calculatePrice()} грн`);
    console.log(`Общая стоимость: ${this.#totalCost} грн`);
    console.log(`Статус: ${this.#status}`);
  }
}


const restaurant_alpha = new Restaurant("Пузата Хата");
const restaurant_bravo = new Restaurant("Супер Печенюшка");

const carbonara = new Dish("Карбонара", 340, "Первые блюда");
const vareniki = new Dish("Вареники", 170, "Основные блюда");
const cake = new Dish("Торт", 250, "Десерты");

const pizza = new Dish("Пицца", 265, "Основные блюда");
const zhulyen = new Dish("Жульен", 240, "Основные блюда");
const salad = new Dish("Салат", 130, "Закуски");

restaurant_alpha.addDish(carbonara);
restaurant_alpha.addDish(vareniki);
restaurant_alpha.addDish(cake);

restaurant_bravo.addDish(pizza);
restaurant_bravo.addDish(zhulyen);
restaurant_bravo.addDish(salad);


const customer_alex = new Customer("Алекс", "+380");
const customer_sanya = new Customer("Саня", "+380");

const courier_sanya = new Courier("Саня", "+380");
const courier_alex = new Courier("Алекс", "+380");


customer_alex.viewMenu(restaurant_alpha);

const order_alex = customer_alex.createOrder(restaurant_alpha, new BikeDelivery());
order_alex.addDish(carbonara);
order_alex.addDish(vareniki);
customer_alex.placeOrder(order_alex);

order_alex.printInfo();

courier_sanya.acceptOrder(order_alex);
courier_sanya.startDelivery();
courier_sanya.completeDelivery();


customer_sanya.viewMenu(restaurant_bravo);

const order_sanya = customer_sanya.createOrder(restaurant_bravo, new CarDelivery());
order_sanya.addDish(pizza);
order_sanya.addDish(zhulyen);
order_sanya.addDish(salad);
customer_sanya.placeOrder(order_sanya);

order_sanya.printInfo();

courier_alex.acceptOrder(order_sanya);
courier_alex.startDelivery();
courier_alex.completeDelivery();


customer_alex.printOrderHistory();
customer_sanya.printOrderHistory();

courier_sanya.printInfo();
courier_alex.printInfo();
