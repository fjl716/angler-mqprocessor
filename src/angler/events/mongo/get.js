import dbs from '../../dbs';

export default function(table) {
  return {
    event: `${table}.get`,
    invoke: async function (params) {
      const {container, packet} = params;
      if (dbs.tables[table]) {
        let obj = await dbs.tables[table].findOne(packet.data);
        container.send(
          params,
          {
            packet: {
              event: `${table}.load`,
              data: obj
            }
          }, true
        );
      }
    }
  }
};
