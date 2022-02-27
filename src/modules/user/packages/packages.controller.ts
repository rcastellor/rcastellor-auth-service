import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class PackagesController {

    @Get('packages')
    packages() {
        return [];
    }
}
