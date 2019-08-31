import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionControler{
  async index(req, res){
    const subsInMeetups = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [{
        model: Meetup,
        where: {
          date: { [Op.gt]: new Date(), }
        },
        required: true,
      }],
      order: [[Meetup, 'date']]
    });

    return res.json(subsInMeetups);
  }

  async store(req, res){
    const meetup = await Meetup.findByPk(req.params.id, {
      include: User,
    });

    if(!meetup){
      return res.status(400).json({ error: 'Meetup does not exist.' });
    }

    if(meetup.user_id === req.userId){
      return res.status(400).json({ error: 'You can not subscribe in a Meetup you organized.' });
    }

    if(meetup.past){
      return res.status(400).json({ error: 'Meetup already happened.' });
    }

    const checkUserSubscription = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id,
      }
    });

    if(checkUserSubscription){
      return res.status(400).json('You have already been subscribed in this Meetup.');
    }

    const checkAnotherSubscription = await Subscription.findOne({
      where: { user_id: req.userId },
      include:[{
        model: Meetup,
        required: true,
        where: { date: meetup.date },
      }],
    });

    if(checkAnotherSubscription){
      return res.status(400).json('You have another Meetup in the same date.');
    }

    const subscription = await Subscription.create({
      meetup_id: meetup.id,
      user_id: req.userId,
    });

    const user = await User.findByPk(req.userId);

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionControler();
