// Разработайте систему управления доставкой заказов для интернет-магазина.
//
// Компания предлагает несколько вариантов доставки, каждый из которых имеет собственные правила расчета стоимости и обработки заказов.
//
// Требования:
// 1. Создайте систему заказов. Каждый заказ содержит уникальный номер, получателя, адрес, вес посылки и текущий статус.
// 2. Заказ должен проходить этапы: создан, принят в доставку, доставляется, доставлен.
// 3. Запретите произвольное изменение статуса заказа.
// 4. Создайте три вида доставки:
//  - Курьерская: стоимость 100 грн + 20 грн за каждый килограмм.
//  - Экспресс: стоимость 200 грн + 35 грн за каждый килограмм.
//  - Международная: стоимость 500 грн + 70 грн за каждый килограмм.
// 5. Каждый вид доставки должен иметь собственные правила расчета стоимости.
// 6. Курьерская доставка допускает посылки до 20 кг, экспресс — до 10 кг, международная — до 50 кг.
// 7. Нельзя принять заказ, если его вес превышает допустимый предел выбранной доставки.
// 8. Реализуйте возможность отменить заказ до начала доставки.
// 9. После доставки или отмены заказ нельзя изменять.
// 10. Создайте общую систему обработки заказов, которая сможет работать с любым видом доставки без отдельной логики для каждого типа.
// 11. Реализуйте вывод информации обо всех заказах, включая стоимость, способ доставки и статус.
// Дополнительная сложность: добавьте возможность сменить способ доставки до отправки заказа с автоматическим пересчетом стоимости и проверкой ограничений.


// функция которая создает OrderServer + сразу же ее вызвать
const OrderServer = ( function() {
  let _orders = {};
  let _nextId = 1;

  // энумы
  const _status =
  {
    CREATED: "Создан",
    ACCEPTED: "Принят в доставку",
    IN_DELIVERY: "Доставляется",
    DELIVERED: "Доставлен",
    CANCELLED: "Отменен"
  };

  const _messages =
  {
    CANNOT_ACCEPT: "Заказ нельзя принять",
    CANNOT_SEND: "Заказ нельзя отправить",
    CANNOT_COMPLETE: "Заказ нельзя завершить",
    CANNOT_CANCEL: "Заказ нельзя отменить",
    CANNOT_CHANGE_DELIVERY: "Нельзя изменить способ доставки",
    WEIGHT_EXCEEDED: "Вес превышает максимальный возможный вес доставки",
    NEW_DELIVERY_WEIGHT_EXCEEDED: "Вес превышает максимальный возможный вес новой доставки"
  };

  return {
    // возможно это ошибка, но я не хочу использовать .freeze, т.к мы его не изучали
    get Status() { return _status; },
    get Messages() { return _messages; },

    addOrder: function()
    {
      let id = _nextId++;
      _orders[id] = _status.CREATED;
      return id;
    },

    updateStatus: function(id, status)
    {
      // как id in _orders в python
      if(!_orders.hasOwnProperty(id))
      {
        return false;
      }

      _orders[id] = status;
      return true;
    },

    getStatus: function(id) { return _orders[id]; },

    getOrders: function()
    {
      let result = {};

      for(let id in _orders)
      {
        result[id] = _orders[id];
      }

      return result;
    }
  };
})();


function Delivery(name, max_weight)
{
  let _name = name;
  let _max_weight = max_weight;

  this.getName = function() { return _name; }
  this.getMaxWeight = function() { return _max_weight; }

  this.canAccept = function(weight) { return weight > 0 && weight <= _max_weight; }
  this.calculatePrice = function(weight) { return 0; }
}


const courier = Object.create(new Delivery("Курьерская", 20));
courier.calculatePrice = function(weight) { return 100 + 20 * weight; }

const express = Object.create(new Delivery("Экспресс", 10));
express.calculatePrice = function(weight) { return 200 + 35 * weight; }

const international = Object.create(new Delivery("Международная", 50));
international.calculatePrice = function(weight) { return 500 + 70 * weight; }


function Order(recipient, address, weight, delivery)
{
  this.number = OrderServer.addOrder();
  this.recipient = recipient;
  this.address = address;

  let _weight = weight;
  let _delivery = delivery;
  let _price = delivery.calculatePrice(weight);
  
  // 15% шанс что заказ не создатстя
  let _status = Math.random() < 0.15 ? OrderServer.Status.ACCEPTED : OrderServer.Status.CREATED;

  OrderServer.updateStatus(this.number, _status);

  this.getStatus = function() { return _status; }
  this.getPrice = function() { return _price; }

  this.accept = function()
  {
    if(_status != OrderServer.Status.CREATED)
    {
      console.log(OrderServer.Messages.CANNOT_ACCEPT);
      return false;
    }

    if(!_delivery.canAccept(_weight))
    {
      console.log(OrderServer.Messages.WEIGHT_EXCEEDED);
      return false;
    }

    _status = OrderServer.Status.ACCEPTED;

    OrderServer.updateStatus(this.number, _status);
    console.log(`Заказ #${this.number} принят`);
    return true;
  }

  this.startDelivery = function()
  {
    if(_status != OrderServer.Status.ACCEPTED)
    {
      console.log(OrderServer.Messages.CANNOT_SEND);
      return false;
    }

    _status = OrderServer.Status.IN_DELIVERY;
    OrderServer.updateStatus(this.number, _status);
    console.log(`Заказ #${this.number} отправлен`);
    return true;
  }

  this.complete = function()
  {
    if(_status != OrderServer.Status.IN_DELIVERY)
    {
      console.log(OrderServer.Messages.CANNOT_COMPLETE);
      return false;
    }

    _status = OrderServer.Status.DELIVERED;
    OrderServer.updateStatus(this.number, _status);
    console.log(`Заказ #${this.number} доставлен`);
    return true;
  }

  this.cancel = function()
  {
    if(_status != OrderServer.Status.CREATED && _status != OrderServer.Status.ACCEPTED)
    {
      console.log(OrderServer.Messages.CANNOT_CANCEL);
      return false;
    }

    _status = OrderServer.Status.CANCELLED;
    OrderServer.updateStatus(this.number, _status);
    console.log(`Заказ #${this.number} успешно отменен`);
    return true;
  }

  this.changeDelivery = function(delivery)
  {
    if(_status != OrderServer.Status.CREATED && _status != OrderServer.Status.ACCEPTED)
    {
      console.log(OrderServer.Messages.CANNOT_CHANGE_DELIVERY);
      return false;
    }

    if(!delivery.canAccept(_weight))
    {
      console.log(OrderServer.Messages.NEW_DELIVERY_WEIGHT_EXCEEDED);
      return false;
    }

    _delivery = delivery;
    _price = delivery.calculatePrice(_weight);

    console.log(`Способ доставки был изменен на: "${delivery.getName()}"`);
    return true;
  }

  this.printInfo = function()
  {
    console.log(`Заказ: #${this.number};\nПолучатель: ${this.recipient};\nАдрес: ${this.address};\nВес: ${_weight} кг;\nДоставка: ${_delivery.getName()};\nСтоимость: ${_price} грн;\nСтатус: ${_status}`);
  }
}


const order1 = new Order("Алекс", "Запорожье", 5, courier);
const order2 = new Order("Саня", "Запорожье", 8, express);
const order3 = new Order("Саша", "Запорожье", 25, international);


order1.printInfo();
order1.accept();
order1.startDelivery();
order1.complete();
order1.cancel();


order2.printInfo();
order2.accept();
order2.changeDelivery(courier);
order2.printInfo();
order2.cancel();


order3.printInfo();
order3.accept();


const orders = [order1, order2, order3];
for(let order of orders)
{
  order.printInfo();
}

console.log("Реестр заказов:", OrderServer.getOrders());
