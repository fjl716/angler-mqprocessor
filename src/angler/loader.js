import {MongoDataBase} from './database/mongo';
import angler,{initContainers,initMongo,initMySql,initSolr,initEvent} from './index'
import log4js from 'log4js'

const logger = log4js.getLogger('angler');

async function init(step,func) {
  try {
    await func();
  }catch (ex){
    logger.fatal(`initialize ${step} failed`);
    return true;
  }
  logger.trace(`initialize ${step} finish`);
  return false;
}

async function mongoLoader(confDB) {
  const conf = new MongoDataBase(confDB);
  await conf.init();
  logger.trace('link confDB');

  if (await init('Containers', async () => {
      const container = await conf.find('container', {pageSize: 1000});
      await initContainers(container);
    }))
    return;

  if (await init('MongoDB', async () => {
      const mongo = await conf.find('mongo', {pageSize: 1000});
      await initMongo(mongo);
    }))
    return;

  if (await init('MySql', async () => {
      const mysql = await conf.find('mysql', {pageSize: 1000});
      await initMySql(mysql);
    }))
    return;

  if (await init('Solr', async () => {
      const solr = await conf.find('solr', {pageSize: 1000});
      await initSolr(solr);
    }))
    return;

  if (await init('Event', async () => {
      const event = await conf.find('event', {pageSize: 1000});
      await initEvent(event);
    }))
    return;
  return angler;
}

export {
  mongoLoader
}
