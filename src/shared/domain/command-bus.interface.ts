import { DomainEvent } from './domain-event.interface';

export interface ICommandBus {
    dispatch(domainEvent: DomainEvent): void;
}