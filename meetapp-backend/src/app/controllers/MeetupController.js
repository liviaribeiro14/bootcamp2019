import * as Yup from 'yup';
import { isBefore, startOfHour, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async index(req, res){
    const meetups = await Meetup.findAll({
      where: {
        organizer_id: req.userId,
      },
      order: ['date'],
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [{
        model: File,
        as: 'banner',
        attributes: ['id', 'path', 'url'],
      }, {
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email'],
      }],
    });

    return res.json(meetups);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      banner_id: Yup.number().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails.' });
    }

    /**
     * Date in the past
     */
    const { date } = req.body;
    const meetingHourStart = startOfHour(parseISO(date));

    if(isBefore(meetingHourStart, new Date())){
      return res.status(401).json({ error: 'Meetups can not be stored in the past.'});
    }

    /**
     * If organizer already has a meeting in the same day and hour
     */
    const findMeeting = await Meetup.findOne({
      where: {
        organizer_id: req.userId,
        date: meetingHourStart
      },
    });

    if(findMeeting){
      return res.status(400).json({ error: 'Meetup date is not available.'});
    }

    const { title, description, location, banner_id } = req.body;

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date: meetingHourStart,
      banner_id: banner_id,
      organizer_id,
    });

    return res.json(meetup);
  }

  async update(req, res){
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      banner_id: Yup.number().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if(req.userId !== meetup.organizer_id){
      return res.status(400).json('You can not update this Meetup.');
    }

    if(meetup.past){
      return res.status(400).json('Meetup has started.');
    }

    const { date } = req.body;
    const meetingHourStart = startOfHour(parseISO(date));

    if(isBefore(meetingHourStart, new Date())){
      return res.status(401).json({ error: 'Meetups can not be stored in the past.'});
    }

    const { title, description, location, banner_id } = req.body;

    await meetup.update({
      title,
      description,
      location,
      date: meetingHourStart,
      banner_id
    });

    return res.json(meetup);
  }
  /**
   *

Crie uma rota para listar os meetups que são organizados pelo usuário logado.

O usuário deve poder cancelar meetups organizados por ele e que ainda não aconteceram. O cancelamento deve deletar o meetup da base de dados

*/
}

export default new MeetupController();
