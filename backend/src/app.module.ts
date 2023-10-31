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
import { ChatBotModule, CompanyModule, MailModule, UserModule, RoleModule, AiAppModule, PromptModule, MessageModule, SiteMapModule, FileModule } from './modules';
import { AppEntity, ChatBotEntity, CompanyEntity, FileEntity, MessageEntity, PromptEntity, RoleEntity, SiteMapEntity, UserEntity } from './entities';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ ConfigDatabase ],
      isGlobal: true
    }), 
    CacheModule.register(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type:        "mysql",
        host:        configService.get('DB_HOST'),
        port:        parseInt(configService.get('DB_PORT')),
        database:    configService.get('DB_DATABASE'),
        username:    configService.get('DB_USERNAME'),
        password:    configService.get('DB_PASSWORD'),
        entities:    [
          AppEntity,
          ChatBotEntity,
          CompanyEntity,
          FileEntity,
          MessageEntity,
          PromptEntity,
          RoleEntity,
          SiteMapEntity,
          UserEntity
        ],
        synchronize: true
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SESSION_KEY'),
        signOptions: { expiresIn: configService.get('JWT_SESSION_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
    MailModule,   
    ChatBotModule,
    CompanyModule,
    FileModule,
    MessageModule,
    AiAppModule,
    PromptModule,
    RoleModule,
    SiteMapModule,
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

