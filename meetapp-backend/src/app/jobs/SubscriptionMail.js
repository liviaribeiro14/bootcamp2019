import Mail from "../../lib/Mail";

class SubscriptionMail {
  get key(){
    return 'SubscriptionMail';
  }

  async handle({ data }){
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${ meetup.User.name } <${ meetup.User.email }>`,
      subject: 'Inscrição no Meetup',
      template: 'subscription',
      context: {
        organizer: meetup.User.name,
        title: meetup.title,
        user: user.name,
        usermail: user.email,
      }
    });
  }
}

export default new SubscriptionMail();
