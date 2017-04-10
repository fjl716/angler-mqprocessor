import events from '../../angler/events'
import dbs from '../../angler/dbs'
import sidebar from './sidebar'
import user from './user'

export default async function (container) {

  const list = await dbs.mongo.find('events', {pageSize: 1000});

  container.event(
    list.map(item => {
      const {path, event, params} = item;
      return events(path, event, params)
    })
  );
  // let requireFromString = require('require-from-string');
  //
  // let d = requireFromString('import dbs from "../../angler/dbs";module.exports = function(){return 1}');
  // console.log(d(1));

  // require('./sidebar');
  container.event(sidebar);
  container.event(user);

}
