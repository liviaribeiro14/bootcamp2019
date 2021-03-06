import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController{
  async index(req, res){
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true}
    });

    if(!checkIsProvider){
      res.status(400).json({error: 'User is not a provider.'});
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        }
      },
      order: ['date']
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
