import User from '../models/User'

class UserController{
  async store(req, res){
    //validation

    const userExists = await User.findOne({ where: { email: req.body.email }});
    if(userExists){
      res.status(400).json({ error: "User already exists."});
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res){
    const { email, oldPassword, password, confirmPassword } = req.body;



    await User.update(req.body);

    return res.json();
  }
}

export default new UserController();
