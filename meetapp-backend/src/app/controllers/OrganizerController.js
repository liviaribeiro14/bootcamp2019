import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class OrganizerController{
  async index(req, res){
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      order: ['date'],
      include: [{
        model: File,
        attributes: ['id', 'path', 'url'],
      }, {
        model: User,
      }],
    });

    return res.json(meetups);
  }
}

export default new OrganizerController();
