import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, RedirectIfAuthMiddleware } from './middlewares';
import { AiAppController, AuthController, ChatbotController } from './controllers';
import { AppService } from './app.service';
import { JwtStrategy, LocalStrategy } from './guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigDatabase } from './config';
import { AuthService, OpenAIService } from './services';
import { ChatBotModule, CompanyModule, MailModule, UserModule, RoleModule, AiAppModule, PromptModule, MessageModule } from './modules';
import { AppEntity, ChatBotEntity, CompanyEntity, MessageEntity, PromptEntity, RoleEntity, UserEntity } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigDatabase ],
      isGlobal: true
    }), 
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type:        "mysql",
      host:        process.env.DB_HOST,
      port:        parseInt(process.env.DB_PORT),
      database:    process.env.DB_DATABASE,
      username:    process.env.DB_USERNAME,
      password:    process.env.DB_PASSWORD,
      entities:    [
        AppEntity,
        ChatBotEntity,
        CompanyEntity,
        MessageEntity,
        PromptEntity,
        RoleEntity,
        UserEntity
      ],
      synchronize: true
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SESSION_KEY,
      signOptions: { expiresIn: process.env.JWT_SESSION_EXPIRES },
    }),
    MailModule,   
    ChatBotModule,
    CompanyModule,
    MessageModule,
    AiAppModule,
    PromptModule,
    RoleModule,
    UserModule 
  ],
  controllers: [AuthController,AiAppController, ChatbotController],
  providers: [AppService,AuthService,OpenAIService,JwtStrategy,LocalStrategy],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware)
            .forRoutes("*");
    consumer.apply(RedirectIfAuthMiddleware)
            .exclude(
              'auth/logout'
            )
            .forRoutes(AuthController)            
  }
}

