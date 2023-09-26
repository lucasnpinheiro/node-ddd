import Customer from "../entity/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendConsoleLogCreatedHandler from "../event/handler/send-console-log-created.handler";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import SendConsoleLogAddressChangedHandler from "../event/handler/send-console-log-address-changed.handler";

export default class CustomerFactory {
  public static create(name: string): Customer {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogCreatedHandler();

    const customer = new Customer(uuid(), name);

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    const customerCreatedEvent = new CustomerCreatedEvent(customer);
    eventDispatcher.notify(customerCreatedEvent);

    return customer;
  }

  public static createWithAddress(name: string, address: Address): Customer {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogAddressChangedHandler();

    const customer = new Customer(uuid(), name);

    customer.changeAddress(address);

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
    const customerAddressChangedEvent = new CustomerAddressChangedEvent(customer);
    eventDispatcher.notify(customerAddressChangedEvent);

    return customer;
  }
}
