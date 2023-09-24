import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map(item => ({
          id: item.id,
          name: item.name,
          order_id: entity.id,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity
        }))
      },
      {
        include: [{ model: OrderItemModel }]
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total()
    }, {
      where: {
        id: entity.id
      }
    })

    await OrderItemModel.destroy({
      where: {
        order_id: entity.id
      }
    })

    await OrderItemModel.bulkCreate(entity.items.map(item => ({
      id: item.id,
      name: item.name,
      order_id: entity.id,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity
    })))
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }]
    });

    if (!orderModel) {
      throw new Error("Order not found");
    }

    const orderItems: OrderItem[] = orderModel.items.map(
      (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    );

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderItems
    );
  }


  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: [{ model: OrderItemModel }]
    });

    if (ordersModel.length === 0) {
      return [];
    }

    return ordersModel.map(
      (order) => new Order(
        order.id,
        order.customer_id,
        order.items.map(
          (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        )
      )
    )

  }
}
