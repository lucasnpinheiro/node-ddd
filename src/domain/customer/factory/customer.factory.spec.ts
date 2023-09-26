import CustomerFactory from "./customer.factory";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendConsoleLogCreatedHandler from "../event/handler/send-console-log-created.handler";
import CustomerCreatedEvent from "../event/customer-created.event";
import SendConsoleLogAddressChangedHandler from "../event/handler/send-console-log-address-changed.handler";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";

describe("Customer factory unit test", () => {
  it("should create a customer", () => {
    let customer = CustomerFactory.create("John");

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBeUndefined();
  });

  it("should create a customer with an address", () => {
    const address = new Address("Street", 1, "13330-250", "São Paulo");

    let customer = CustomerFactory.createWithAddress("John", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBe(address);
  });

  it("should create a customer and dispatch an event", () => {
    const customer = CustomerFactory.create("John");

    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    const customerCreatedEvent = new CustomerCreatedEvent(customer);
    eventDispatcher.notify(customerCreatedEvent);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.rewardPoints).toBe(0);
    expect(customer.Address).toBeUndefined();
    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should create a customer with an address and dispatch an event", () => {

    const address = new Address("Street", 1, "13330-250", "São Paulo");
    const customer = CustomerFactory.createWithAddress("John", address);

    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogAddressChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
    const customerAddressChangedEvent = new CustomerAddressChangedEvent(customer);
    eventDispatcher.notify(customerAddressChangedEvent);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.rewardPoints).toBe(0);
    expect(customer.Address).toBe(address);
    expect(spyEventHandler).toHaveBeenCalled();
  });

});
