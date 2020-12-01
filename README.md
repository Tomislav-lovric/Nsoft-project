# Stake Limit service

Web service that is be able to restrict devices that accept more stake than desired.

### Prerequisites

What things you need to run the app:

```
NODE JS
XAMPP
POSTMAN
```

## Launching the app

You need to launch Apache and MYSql in XAMPP, then start the app (use npm start in terminal in VS code) and then to create user, send ticket, etc. use the Postman to send data (json).

## API's

### Users API

Used to create users where user needs to fill in his firstName, lastName, email, password and repeated password. It also uses RegEx to check if user filled in those fields correctly (ex. password has to have more than 8 and less than 16 characters, it also has to contain at least one number and one special character).

Users can also login where they need to use their email and password, so they can get their device_id which they'll need to be able to send tickets.

### Tickets API

Used to change ticket limit where users need to fill in time_duration, stake_limit, hot_percentage and restriction_expires, in case they don't fill it right or don't put anything it leaves already existing value.

Users can also look up stake limits.

Used to send ticket where users have to provide their device_id (which they can get from login) and stake (which has to be a number > 0 and it can only have 2 decimals). Before sending ticket to database it checks for users status, if everything is ok it will send ticket and return user his status (OK or HOT) if not it will return either error, if someting went wrong that shouldn't have, or status BLOCKED if users sum of stakes went past stake limit.

### Examples

Going to the http://localhost:3000/user/registration and filling in fileds like this:

```
{
	"firstName": "testNesto",
	"lastName": "testNesto",
	"email": "test12345@gmail.com",
	"password": "test1234",
	"repeatedPassword": "test1234"
}
```

will return:

```
{
    "message": "Invalid password. Password has to have more than 8 and less than 16 characters, it has to contain at least on number and one special character"
}
```

## Author

* **Tomislav Lovrić** - https://github.com/Tomislav-lovric

## Acknowledgments

* Hat tip to Google and Youtube
