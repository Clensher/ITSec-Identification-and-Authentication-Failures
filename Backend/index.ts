import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { IoContainer } from './core/ioc/ioc.container';
import { LoggerService } from './core/services/logger.service';
import { DatabaseService } from './core/services/database.service';
import { PasswordService } from './core/services/password.service';

const container = new IoContainer();
container.init();

const logger = container.getContainer().resolve(LoggerService);
const databseService = container.getContainer().resolve(DatabaseService);
const passwordService = container.getContainer().resolve(PasswordService);

const server = new InversifyExpressServer(container.getContainer());

server.setConfig((app) => {
    var cors = require('cors');
    app.use(cors({origin: `*`}));
    app.options('https://localhost:4200', cors());
});

databseService.initialize().then(()=>{
    const app = server.build();
    app.listen(9999);
    logger.info('Server listening on port 9999')
}).catch((error)=>{
    logger.error(error, 'Error while starting express server');
    process.exit(-1);
});

