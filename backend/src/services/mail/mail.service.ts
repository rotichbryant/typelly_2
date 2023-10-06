import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entities';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendUserConfirmation(user: UserEntity) {
    const url = `${this.configService.get('APP_URL')}/email/confirmation/${user.token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'register', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: `${user.first_name} ${user.last_name}`,
        url,
      },
    });
  }
}