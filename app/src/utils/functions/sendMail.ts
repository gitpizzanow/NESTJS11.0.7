import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { configuration } from 'src/configs/configuration';

export default async function sendMail(mailerService: MailerService, sendMailOptions: ISendMailOptions) {
  // mail redirection in dev env
  if (!configuration().production) {
    sendMailOptions.subject += `(Redirected from ${sendMailOptions.to})`;
    sendMailOptions.to = configuration().mailerDevEnvRedirectEmail;
  }
  mailerService.sendMail(sendMailOptions).catch((err) => {
    console.log(err);
  });
}
