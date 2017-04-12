import mongo from './mongo'
import mysql from './mysql'
import remoting from './remoting'
import solr from './solr'
import angler from '../angler'
let requireFromString = require('require-from-string');

const events = {
  mongo,
  solr,
  mysql,
  remoting,
};

async function initEvent(list) {
  list.map(conf => {
    const {path, container, event, invoke, params} = conf;
    const id = `C${container}`;
    if (angler.containers[id]) {
      const container = angler.containers[id];
      let module;
      if (invoke) {
        module = requireFromString(`module.exports = {
    event: '${event}',
    invoke: async function (params) {
       ${invoke}
    }
  };`);
      } else if (path) {
        let sp = path.split('.');
        let func = events;
        sp.map(name => {
          func = func[name];
        });
        return func(event, params)
      }
      container.event(module);
    } else {
      console.warn(`not found ${container}`);
    }
  });
}

export {
  mongo,
  solr,
  mysql,
  remoting,
  initEvent,
}
