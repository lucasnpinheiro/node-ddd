import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import Customer from "../../../../domain/customer/entity/customer";
import { v4 as uuid } from "uuid";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "City 1", "zipcode 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);

    const order = new Order(uuid(), customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          order_id: order.id,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity
        }
      ]
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "City 1", "zipcode 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);

    const order = new Order(uuid(), customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          order_id: order.id,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity
        }
      ]
    });

    const newOrderItem = new OrderItem(uuid(), product.name, product.price, product.id, 3);
    order.addItem(newOrderItem);
    console.log(order);
    await orderRepository.update(order);

    const updatedOrderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    });

    console.log(updatedOrderModel.toJSON());

    expect(updatedOrderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          order_id: order.id,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity
        },
        {
          id: newOrderItem.id,
          name: newOrderItem.name,
          order_id: order.id,
          price: newOrderItem.price,
          product_id: newOrderItem.productId,
          quantity: newOrderItem.quantity
        }
      ]
    });
  })

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "City 1", "zipcode 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);

    const order = new Order(uuid(), customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(order);
  })

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();
    await expect(orderRepository.find(uuid())).rejects.toThrowError("Order not found");
  })

  it("should find all an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "City 1", "zipcode 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);

    const order = new Order(uuid(), customer.id, [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toStrictEqual([order]);
  })

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();
    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toStrictEqual([]);
  })

});
