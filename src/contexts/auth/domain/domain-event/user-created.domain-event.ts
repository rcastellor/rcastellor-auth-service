import { DomainEvent } from '../../../../shared/domain/domain-event.interface';

type UserCreatedDomainEventBody = {
    readonly uuid: string;
    readonly username: string;
    readonly email: string;
    readonly status: string;
    readonly eventName: string;
};

export class UserCreatedDomainEvent extends DomainEvent {

    static readonly EVENT_NAME = 'user.created';

    readonly username: string;
    readonly email: string;
    readonly status: string;

    constructor({ uuid, username, email, status, eventId, occurredOn }: {
        uuid: string, username: string, email: string, status: string, eventId?: string, occurredOn?: Date
    }) {
        super(UserCreatedDomainEvent.EVENT_NAME, uuid, eventId, occurredOn);
        this.username = username;
        this.email = email;
        this.status = status;
    }

    toPrimitive(): UserCreatedDomainEventBody {
        const { aggregateId, username, email, status } = this;
        return {
            username,
            email,
            status,
            eventName: UserCreatedDomainEvent.EVENT_NAME,
            uuid: aggregateId
        };
    }

}