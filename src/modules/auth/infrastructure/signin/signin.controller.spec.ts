import { Test, TestingModule } from '@nestjs/testing';
import { SigninController } from './signin.controller';
import { JwtModule } from '@nestjs/jwt';

describe('SigninController', () => {
  let controller: SigninController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'TODO',
          signOptions: { expiresIn: '3600s' },
        }),
      ],
      controllers: [SigninController],
    }).compile();

    controller = module.get<SigninController>(SigninController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
