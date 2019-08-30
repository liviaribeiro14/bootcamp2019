import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import SubscriptionMail from '../app/jobs/SubscriptionMail';

const jobs = [ SubscriptionMail ];

class Queue {
  constructor() {
    this.queues = { };

    this.init();
  }

  init() {
    jobs.forEach(({key, handle}) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      }
    });
  }

  add(queue, job){
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue(){
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailed).process(handle);
    });
  }

  handleFailed(job, err){
    console.log(`Queue ${job.queue.name}: FALIED`, err);
  }
}

export default new Queue();
