import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet, httpPost, httpPut, interfaces, requestParam } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { LoggerService } from '../../core/services/logger.service';
import { PasswordService } from '../../core/services/password.service';

@controller('/admin')
@injectable()
export class AdminController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService, @inject(LoggerService.name) private loggerService: LoggerService, @inject(PasswordService.name) private passwordService: PasswordService,
  ) {}

  @httpPost('/:firstname&:lastname&:email&:username&:password')
  public createAdmin(request: Request, response: Response): void {
    let checkPassword = this.passwordService.checkPasswordSecurity(request.params.password);
    this.loggerService.info("Check of password resulted in: " + checkPassword);
    if (checkPassword){
      this.databaseService.createAdmin(request.params.firstname, request.params.lastname, request.params.email, request.params.username, request.params.password)
      .then((result) => {
        this.loggerService.info('admin registered');
        this.databaseService.createHistoryEntry(request.params.username, 'new admin created');
        response.json(result);
      });
    }
    else {
      this.loggerService.info('failed to register admin because of secure password policy violations.');
      let result = { errors: 1,
                     errorSource: "password",
                     message: "Password violates the password security policies.",
                     passwordPolicyDescription: this.passwordService.getPolicyDescription() };
      response.json(result);
    }
  }

  @httpPut('/:username&:password&:firstname&:lastname&:email&:newusername&:newpassword')
  public editAdmin(request: Request, response: Response): void {
    this.databaseService.editAdmin(request.params.username, request.params.password, request.params.firstname, request.params.lastname, request.params.email, request.params.newusername, request.params.newpassword)
    .then((result) => {
      this.loggerService.info('admin edited');
      this.databaseService.createHistoryEntry(request.params.username, 'admin edited');
      response.json(result);
    });
  }

  @httpGet('/:username&:password')
  public loginAdmin(request: Request, response: Response): void {
    this.databaseService.loginAdmin(request.params.username, request.params.password)
    .then((result) => {
      if ('adminExists' in result){
        response.json(result);
      }
      else{
        this.databaseService.createHistoryEntry(request.params.username, 'admin logged in');
        this.loggerService.info('admin logged in');
        response.json(result)
      }
    });
  }
}
