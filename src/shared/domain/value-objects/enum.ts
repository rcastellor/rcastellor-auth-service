import { InvalidArgumentError } from './invalid-argument-error';
import { ErrorMessage } from '../error.enum';

export abstract class EnumValueObject<T> {
    readonly value: T;
  
    constructor(value: T, public readonly validValues: T[]) {
      this.value = value;
      this.checkValueIsValid(value);
    }
  
    public checkValueIsValid(value: T): void {
      if (!this.validValues.includes(value)) {
          throw new InvalidArgumentError(ErrorMessage.INVALID_ARGUMENT)
      }
    }
  
  }