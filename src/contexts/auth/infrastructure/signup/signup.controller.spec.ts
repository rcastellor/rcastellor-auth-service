import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { FakeUserRepository } from '../fake-user.repository';
import { SignupController } from './signup.controller';

describe('SignupController', () => {
  let controller: SignupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ SharedModule ],
      controllers: [
        SignupController
      ],
      providers: [
        {
          provide: 'UserRepository',
          useClass: FakeUserRepository,
        },
      ]
    }).compile();

    controller = module.get<SignupController>(SignupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
