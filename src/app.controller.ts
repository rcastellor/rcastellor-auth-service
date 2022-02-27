import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ICommandBus } from './shared/domain/command-bus.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('ICommandBus') private readonly commandBus: ICommandBus) {}

  @Get()
  getHello(): string {
    //this.commandBus.dispatch({aaa: 0});
    return this.appService.getHello();
  }
}
