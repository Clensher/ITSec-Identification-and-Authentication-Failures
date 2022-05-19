import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet, httpPost, httpPut, interfaces, requestParam } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { LoggerService } from '../../core/services/logger.service';
import { PasswordPolicyEnforcerService } from '../../core/services/password-policy-enforcer.service';

@controller('/admin')
@injectable()
export class AdminController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService, @inject(LoggerService.name) private loggerService: LoggerService, @inject(PasswordPolicyEnforcerService.name) private passwordPolicyEnforcerService
  ) {}

  @httpPost('/:firstname&:lastname&:email&:username&:password&:passwordrepetition')
  public createAdmin(request: Request, response: Response): void 
  {
    let password = request.params.password;
    let passwortRepetition = request.params.passwordrepetition;

    if (password != passwortRepetition)
    {
      this.loggerService.info('Error: The password and the password repetition do not match!');
      
      let result = { errors: 1,
                     errorSource: "Password and Password Repetition.",
                     message: 'Error: The password and the password repetition do not match!' };
    }
    else if (this.passwordPolicyEnforcerService.enforcePasswordPolicies(password))
    {
      this.databaseService.createAdmin(request.params.firstname, 
                                       request.params.lastname, 
                                       request.params.email, 
                                       request.params.username, 
                                       request.params.password).then((result) => {
        this.loggerService.info('New Admin registered!');
        this.databaseService.createHistoryEntry(request.params.username, 'New Admin registered!');
        response.json(result);
      });
    }
    else {
      this.loggerService.info('Error: Password doesnt match policies. Length must be greater 16. Must containe atleast one number, one uppercase and one symbol from ["!", "?", ",", ".", ":", "-"]!');
      let result = { errors: 1,
                     errorSource: "Password",
                     message: 'Error: Password doesnt match policies. Length must be greater 16. Must containe atleast one number, one uppercase and one symbol from ["!", "?", ",", ".", ":", "-"]!'};
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
