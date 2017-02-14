import {Queue} from './collection';
import watcher from './watcher';

class Drive{
  constructor(address) {
    this.channel = null;
    this.queue = new Queue();
    this.current = null;
    this.address = address;
  }

  online(channel){
    this.channel = channel;
    if (!this.current) {
      this.start();
    }
  }

  work(task) {
    task.drive = this;
    this.queue.enqueue(task);
    if (!this.current) {
      this.start();
    }
  }

  start() {
    this.current = null;
    if (this.queue.size() > 0) {
      this.current = this.queue.dequeue();
      const {pack, span} = this.current.first();
      console.log(this.channel);
      this.channel.send(pack);
      watcher.add(this.current, span);
    }
  }

  arrive(pack) {
    if (this.current) {
      const result = this.current.arrive(pack);
      if (result) {
        const {pack, span} =result;
        console.log(this.channel);
        this.channel.send(pack);
        watcher.add(this.current, span);
      }
    }
  }
}

export default Drive;