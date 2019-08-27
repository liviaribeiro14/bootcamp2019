import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Notification from '../schemas/Notification';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class AppointmentController{
  async index(req, res){
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page -1) * 20,
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: File,
          as: 'avatar',
          attributes:['id', 'path', 'url'],
        }],
      }],
    });

    return res.json(appointments);
  }

  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      res.status(400).json({ error: 'Validation fails'});
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: {id: provider_id, provider: true },
    })

    if(!isProvider){
      res.status(401).json({ error: 'You can only create appointments with providers.'});
    }

     /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if(isBefore(hourStart, new Date())){
      return res.status(400).json('Past dates are not permited.');
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      }
    });

    if(checkAvailability){
      return res.status(400).json('Appointment date is not available.');
    }

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}.`,
      user: provider_id
    });

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    res.json(appointment);
  }
}

export default new AppointmentController();
