import { inject, injectable } from 'inversify';
import { LoggerService } from './logger.service';
import { Connection, r, RConnectionOptions, RDatum } from 'rethinkdb-ts';
import * as databaseConfiguration from '../../config/database-config.json';
import { Admin } from '../../models/admin.model';
import { Entry } from '../../models/entry.model';
import { response } from 'express';

@injectable()
export class DatabaseService {
  constructor(
    @inject(LoggerService.name) private loggerService: LoggerService
  ) {}

  public async initialize(): Promise<boolean> {
    const connection = await this.connect();
    r.dbList()
      .contains(databaseConfiguration.databaseName)
      .do((containsDatabase: RDatum<boolean>) => {
        return r.branch(
          containsDatabase,
          { created: 0 },
          r.dbCreate(databaseConfiguration.databaseName)
        );
      })
      .run(connection)
      .then(() => {
        this.loggerService.info('Trying to create tables');
        this.createTables(connection)
          .then(() => {
            this.loggerService.info('Tables created');
            return Promise.resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error);
            return Promise.reject(false);
          });
      });
      return Promise.resolve(true);
  }

  public createAdmin(firstname: string, lastname: string, email: string, username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Admin')
          .insert({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: password
          })
          .run(connection)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while creating admin');
          });
      });
    });
  }

  public editAdmin(username: string, password: string, firstname: string, lastname: string, email: string, newusername: string, newpassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Admin')
          .filter({
            username: username,
            password: password
          })
          .update({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: newusername,
            password: newpassword
          })
          .run(connection)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while creating admin');
          });
      });
    });
  }

  public loginAdmin(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Admin')
          .filter({
            username: username,
            password: password
          })
          .isEmpty()
          .do((exists: RDatum<boolean>) => {
            return r.branch(
              exists,
              {adminExists: false},
              r.db(databaseConfiguration.databaseName)
                .table('Admin')
                .filter({
                  username: username,
                  password: password
                })
            );
          })
          .run(connection)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving admin');
          });
      });
    });
  }

  public getAllEntries(): Promise<Array<Entry>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Entry')
          .filter({})
          .run(connection)
          .then((response: Array<Entry>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving entries');
          });
      });
    });
  }

  public getEntryById(id: string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Entry')
          .filter({id: id})
          .isEmpty()
          .do((exists: RDatum<boolean>) => {
            return r.branch(
              exists,
              {entryExists: false},
              r.db(databaseConfiguration.databaseName)
                .table('Entry')
                .filter({id: id})
            );
          })
          .run(connection)
          .then((response: Array<Entry>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving entry');
          });
      });
    });
  }

  public checkin(firstname: string, lastname: string, phonenumber: string, email: string, company: string, street: string, postalcode: string, city: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Entry')
          .insert({
            firstname: firstname,
            lastname: lastname,
            phonenumber: phonenumber,
            email: email,
            company: company,
            street: street,
            postalcode: postalcode,
            city: city,
            checkedOut: false,
            checkinTime: new Date(),
            checkoutTime: null
          })
          .run(connection)
          .then((response) => {
            this.loggerService.info('Entry created');
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while creating entry');
          });
      });
    });
  }

  public editEntry(id: string, firstname: string, lastname: string, phonenumber: string, email: string, company: string, street: string, postalcode: string, city: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Entry')
          .filter({id: id})
          .update({
            firstname: firstname,
            lastname: lastname,
            phonenumber: phonenumber,
            email: email,
            company: company,
            street: street,
            postalcode: postalcode,
            city: city
          })
          .run(connection)
          .then((response) => {
            this.loggerService.info('Entry created');
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while creating entry');
          });
      });
    });
  }

  public deleteEntry(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Entry')
          .filter({id: id})
          .delete({})
          .run(connection)
          .then((response) => {
            this.loggerService.info('Entry created');
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while creating entry');
          });
      });
    });
  }

  public checkout(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('Entry')
          .filter({id: id})
          .update({
            checkedOut: true,
            checkoutTime: new Date()
          })
          .run(connection)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while checkout');
          });
      });
    });
  }

  public createHistoryEntry(admin: string, description: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('History')
          .insert({
            admin: admin,
            description: description,
            time: Date.now()
          })
          .run(connection)
          .then((response) => {
            this.loggerService.info('history entry created');
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while creating entry');
          });
      });
    });
  }

  private createTables(connection: Connection): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promises = new Array<Promise<boolean>>();
      databaseConfiguration.databaseTables.forEach((table) => {
        promises.push(this.createTable(connection, table));
      });
      Promise.all(promises)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private createTable(
    connection: Connection,
    tableName: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      r.db(databaseConfiguration.databaseName)
        .tableList()
        .contains(tableName)
        .do((containsTable: RDatum<boolean>) => {
          return r.branch(
            containsTable,
            { create: 0 },
            r.db(databaseConfiguration.databaseName).tableCreate(tableName)
          );
        })
        .run(connection)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private connect(): Promise<Connection> {
    const rethinkDbOptions: RConnectionOptions = {
      host: databaseConfiguration.databaseServer,
      port: databaseConfiguration.databasePort,
    };
    return new Promise((resolve, reject) => {
      r.connect(rethinkDbOptions)
        .then((connection: Connection) => {
          resolve(connection);
        })
        .catch(reject);
    });
  }
}
