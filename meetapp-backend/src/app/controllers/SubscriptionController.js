import { isBefore } from 'date-fns';
import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionControler{
  async store(req, res){
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(401).json('Validation fails.');
    }

    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

    if(!meetup){
      return res.status(400).json({ error: 'Meetup does not exist.' });
    }

    if(meetup.organizer_id === req.userId){
      return res.status(400).json({ error: 'You can not subscribe in a Meetup you organized.' });
    }

    if(isBefore(meetup.date, new Date())){
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
        where: { date: meetup.date },
      }],
    });

    if(checkAnotherSubscription){
      return res.status(400).json('You have another Meetup in the same date.');
    }

    await Subscription.create({
      meetup_id: meetup.id,
      user_id: req.userId,
    });

    return res.json();
  }
}

export default new SubscriptionControler();
