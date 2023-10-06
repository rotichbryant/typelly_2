import { Test, TestingModule } from '@nestjs/testing';
import { AiAppController } from './ai.app.controller';

describe('AuthController', () => {
  let controller: AiAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiAppController],
    }).compile();

    controller = module.get<AiAppController>(AiAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
