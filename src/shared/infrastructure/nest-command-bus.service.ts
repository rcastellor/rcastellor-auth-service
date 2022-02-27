import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ICommandBus } from '../domain/command-bus.interface';
import { DomainEvent } from '../domain/domain-event.interface';

@Injectable()
export class NestCommandBusService implements ICommandBus {
    constructor(private commandbus: CommandBus) {}

    dispatch(domainEvent: DomainEvent): void {
        this.commandbus.execute(domainEvent);
    }
}