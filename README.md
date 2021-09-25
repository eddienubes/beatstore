# Beatstore
Website made out of reactjs, nodejs, mongodb + telegrafjs for sort of admin panel that I use to manage website via telegram client.  

### Technologies used:

#### Client side:
<i>I will specify several core components, technologies, that i used during development</i>

* `ReactJS` 
* `react-player` - used as a base component for creating audio player
* `Redux` - state container
* Tried out multiple react ui libraries like `semantic-ui-react`, `material-ui` and `react-bootstrap` to see what works best for me :)
* `node-sass` - module to handle scss
* `@fortawesome` - component for beautiful icons  

---

#### Server side | API:
* `Nodejs`
* `nodemailer` - to send confirmation emails and products itself 
* `jsonwebtoken` - used to generate access and refresh tokens for login and signup handling
* `mongoose` - really cool ODM. It was a pure pleasure to work with it.
* `multer` - handy middleware for handling file uploads on the web-server.
* `expressjs` - super convenient web framework
* `@paypal/checkout-server-sdk` - paypal sdk for handling payment of the website

---

#### Server side | Telegram BOT:
* `Telegrafjs` - telegram bot framework
