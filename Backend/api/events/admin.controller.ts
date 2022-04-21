import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet, httpPost, httpPut, interfaces, requestParam } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { LoggerService } from '../../core/services/logger.service';

@controller('/admin')
@injectable()
export class AdminController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService, @inject(LoggerService.name) private loggerService: LoggerService
  ) {}

  @httpPost('/:firstname&:lastname&:email&:username&:password')
  public createAdmin(request: Request, response: Response): void {
    this.databaseService.createAdmin(request.params.firstname, request.params.lastname, request.params.email, request.params.username, request.params.password)
    .then((result) => {
      this.loggerService.info('admin registered');
      this.databaseService.createHistoryEntry(request.params.username, 'new admin created');
      response.json(result);
    });
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
