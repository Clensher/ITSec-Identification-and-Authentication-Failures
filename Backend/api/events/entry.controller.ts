import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet, httpPost, interfaces, httpPut, requestParam, httpDelete } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { LoggerService } from '../../core/services/logger.service';

@controller('/entry')
@injectable()
export class EntryController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService, @inject(LoggerService.name) private loggerService: LoggerService
  ) {}

  @httpPost('/checkin/:firstname&:lastname&:phonenumber&:email&:company&:street&:postalcode&:city')
  public checkin(request: Request, response: Response): void {
    this.databaseService.checkin(request.params.firstname, request.params.lastname, request.params.phonenumber, request.params.email,request.params.company, request.params.street, request.params.postalcode, request.params.city)
    .then((result) => {
      this.databaseService.createHistoryEntry('', 'user checked in');
      this.loggerService.info('user checked in');
      response.json(result);
    });
  }

  @httpPut('/checkout/:id')
  public checkout(request: Request, response: Response): void {
    this.databaseService.getEntryById(request.params.id).then((result) => {
        if ("entryExists" in result){
            response.json(result)
        }
        else{
            if (result[0].checkedOut){
              response.json({checkedOut: true})
            }
            else{
              this.databaseService.checkout(request.params.id)
                .then((result) => {
                  this.databaseService.createHistoryEntry('', 'user checked out');
                  this.loggerService.info('user checked out');
                  response.json(result);
                });
            }
        }
    })
  }

  @httpPost('/checkin/admin/:username&:password&:firstname&:lastname&:phonenumber&:email&:company&:street&:postalcode&:city')
  public adminCheckin(request: Request, response: Response): void {
    this.databaseService.loginAdmin(request.params.username, request.params.password).then((result) => {
      if ('adminExists' in result){
        response.json(result);
      }
      else{
        this.databaseService.checkin(request.params.firstname, request.params.lastname, request.params.phonenumber, request.params.email,request.params.company, request.params.street, request.params.postalcode, request.params.city)
        .then((result) => {
          this.databaseService.createHistoryEntry(request.params.username, 'admin created entry');
          this.loggerService.info('admin created entry');
          response.json(result);
        });
      }
    })
  }

  @httpGet('/:username&:password')
  public getAllEntries(request: Request, response: Response): void {
    this.databaseService.loginAdmin(request.params.username, request.params.password).then((result) => {
      if ('adminExists' in result){
        response.json(result);
      }
      else{
        this.databaseService.getAllEntries().then((result) => {
          this.databaseService.createHistoryEntry(request.params.username, 'admin viewed all entries');
          this.loggerService.info('admin viewed all entries');
          response.json(result);
        });
      }
    })
  }

  @httpGet('/info/:id')
  public getEntryById(request: Request, response: Response): void {
    this.databaseService.getEntryById(request.params.id).then((result) => {
      this.loggerService.info('get entry by id');
      response.json(result)
    })
  }

  @httpPut('/:username&:password&:id&:firstname&:lastname&:phonenumber&:email&:company&:street&:postalcode&:city')
  public editEntry(request: Request, response: Response): void {
    this.databaseService.loginAdmin(request.params.username, request.params.password).then((result) => {
      if ('adminExists' in result){
        response.json(result);
      }
      else{
        this.databaseService.editEntry(request.params.id, request.params.firstname, request.params.lastname, request.params.phonenumber, request.params.email,request.params.company, request.params.street, request.params.postalcode, request.params.city)
        .then((result) => {
          this.databaseService.createHistoryEntry(request.params.username, 'admin edited entry');
          this.loggerService.info('admin edited entry');
          response.json(result);
        });
      }
    })
  }

  @httpDelete('/:username&:password&:id')
  public deleteEntry(request: Request, response: Response): void {
    this.databaseService.loginAdmin(request.params.username, request.params.password).then((result) => {
      if ('adminExists' in result){
        response.json(result);
      }
      else{
        this.databaseService.deleteEntry(request.params.id)
        .then((result) => {
          this.databaseService.createHistoryEntry(request.params.username, 'admin deleted entry');
          this.loggerService.info('admin deleted entry');
          response.json(result);
        });
      }
    })
  }
}
