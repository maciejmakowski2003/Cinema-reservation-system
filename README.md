# Cinema reservation system

## Authors: 
- Maciej Makowski
- Franciszek Job

## Tech stack:
- MongoDB
- Node.js(Express)
- React(Ts)

[github](https://github.com/maciejmakowski2003/Cinema-reservation-system)

## Table of content
1. [Database schemes](#schemes)
2. [Database diagram](#diagram)
3. [CRUD operation 1](#crud1)
4. [CRUD operation 2](#crud2)
5. [Transactional operation](#transactional)
6. [Reporting operation 1](#reporting1)
7. [Reporting operation 2](#reporting2)
8. [Frontend demo](#demo)

### Database schemes <div id="schemes"></div>

#### 1. user
- each document stores information about single user.
```js
const priceValidator = {
    validator: function (value) {
        return value >= 0;
    },
    message: props => `${props.value} is not a valid price. Please provide a price greater than or equal to 0.`
};

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide user email address'],
        unique: [true, 'User email address is already in use'],
        lowercase: [true, 'User email address should be lowercase'],
        trim: [true, 'User email address cannot have spaces at the beginning and at the end'],
        minlength: [3, 'User email address should contain at least 3 characters'],
        maxlength: [120, 'User email address should contain at most 120 characters']
    },
    password: {
        type: String,
            required: [true, 'Please provide user password'],
            trim: [true, 'User password cannot have spaces at the beginning and at the end'],
            minlength: [8, 'User password must contain at least 8 characters'],
            maxlength: [48, 'User password must contain at most 48 characters'],
    },
    role: {
        type: String,
        enum: { values: ['user', 'moderator'], message: '{VALUE} is not supported' },
        default: 'user'
    },
    cart: {
        showing_id: {
            type: Schema.Types.ObjectId,
            ref: 'Showing',
            default: null
        },
        seats: {
            type: [seatScheme],
            default: []
        },
        total_price: {
            type: Number,
            required: true,
            validate: priceValidator,
            default: 0
    }
    }
});
```
```json
{
    "_id": {
        "$oid": "664b36c64a0621df2e31dd38"
    },
    "email": "maciek@gmail.com",
    "password": "$2a$12$vHIe6rf6m7Uwzlo09BfWk.S5ExB3R7kfI21daNRmsIlkogRoFFv0a",
    "role": "user",
    "cart": {
        "showing_id": null,
        "seats": [],
        "total_price": 0
    },
    "__v": 0
}
```
#### 2. cinema
   - each document represents single cinema.
   - if it is open on particular day, field open and close will contain hours. if not, they will be set to closed.
```js
const cinemaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide the cinema name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide the cinema email'],
        unique: true,
    },
    address: {
        type: addressSchema,
        required: [true, 'Please provide the cinema address'],
    },
    opening_hours: {
        type: openingHoursSchema,
        required: [true, 'Please provide the opening hours'],
    },
    halls: {
        type: [Schema.Types.ObjectId],
        ref: 'Hall',
        default: [],
    }
});
```
```js
function isValidTimeFormat(value) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(value);
}

const timeSchema = new Schema({
    open: {
        type: String,
        required: [true, 'Please provide the opening time'],
        validate: {
            validator: isValidTimeFormat,
            message: props => `${props.value} is not a valid hour format (HH:MM)`
        }
    },
    close: {
        type: String,
        required: [true, 'Please provide the closing time'],
        validate: {
            validator: isValidTimeFormat,
            message: props => `${props.value} is not a valid hour format (HH:MM)`
        }
    },
},{ _id : false});
```
```js
const openingHoursSchema = new Schema({
    monday: timeSchema,
    tuesday: timeSchema,
    wednesday: timeSchema,
    thursday: timeSchema,
    friday: timeSchema,
    saturday: timeSchema,
    sunday: timeSchema,
},{ _id : false});
```
```json
{
  "_id": {
    "$oid": "664b18c132cfeae096d90a5b"
  },
  "name": "Multikino Kraków Dobrego pasterza",
  "email": "multikinokrakowdobregopasterza@gmail.com",
  "address": {
    "street": "ul.Dobrego Pasterza 13",
    "city": "Kraków",
    "state": "małopolskie",
    "country": "Polska",
    "zipcode": "32-243"
  },
  "opening_hours": {
    "monday": {
      "open": "08:00",
      "close": "23:00"
    },
    "tuesday": {
      "open": "08:00",
      "close": "23:00"
    },
    "wednesday": {
      "open": "08:00",
      "close": "23:00"
    },
    "thursday": {
      "open": "08:00",
      "close": "23:00"
    },
    "friday": {
      "open": "08:00",
      "close": "23:00"
    },
    "saturday": {
      "open": "08:00",
      "close": "23:00"
    },
    "sunday": {
      "open": "08:00",
      "close": "23:00"
    }
  },
  "halls": [
    {
      "$oid": "664b1d6df55c10ffcb7d7f60"
    },
    {
      "$oid": "664b1e4483963d55d52f5a1f"
    }
  ],
  "__v": 0
}
```
#### 3. hall
   - each document represent single hall
   - each seat can be standard or vip
```js
const hallSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name of the hall'],
    },
    cinema_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: [true, 'Please provide the cinema ID'],
    },
    seats: {
        type: [seatScheme],
        required: [true, 'Please provide the seats configuration'],
    }
});
```
```js
const seatScheme = new Schema({
    row: {
        type: String,
        enum: {
            values: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
            message: '{VALUE} is not a valid seat type'
        },
        required: [true, 'Please provide the row of the seat'],
    },
    number: {
        type: String,
        required: [true, 'Please provide the seat number'],
    },
    type: {
        type: String,
        enum: {
            values: ['vip', 'standard'],
            message: '{VALUE} is not a valid seat type'
        },
        default: 'standard',
        required: [true, 'Please provide the type of the seat'],
    },
    occupied: {
        type: Boolean,
        default: false,
    }
},{ _id : false});
```
```json
{
  "_id": {
    "$oid": "664b1d6df55c10ffcb7d7f60"
  },
  "name": "Sala 1",
  "cinema_id": {
    "$oid": "664b18c132cfeae096d90a5b"
  },
  "seats": [
    {
      "row": "A",
      "number": "0",
      "type": "standard",
      "occupied": false
    },
    {
      "row": "A",
      "number": "1",
      "type": "standard",
      "occupied": false
    },
    ...
    , "__v": 0
  ]
}

```
#### 4. movie
   - each document stores data about single movie
   - reviews from 1 to 5 
 - runtime in minutes
 ```js
  const validateReview = {
      validator: function (value) {
          return value.every(score => score >= 1 && score <= 5 && Number.isInteger(score));
      },
      message: props => `${props.value} is not a valid review score. Please provide a score between 1 and 5.`
  };


  const movieSchema = new Schema({
      title: {
          type: String,
          unique: true,
          required: [true, 'Please provide the movie title'],
      },
      description: {
          type: String,
          required: [true, 'Please provide the movie description']
      },
      runtime: {
          type: Number,
          required: [true, 'Please provide the runtime of the movie']
      },
      reviews: {
          type: [Number],
          required: [true, 'Please provide reviews for the movie'],
          default: [],
          validate: validateReview,
      }
  });

  movieSchema.index({ title: 1 }, { unique: true });
 ```
 ```json
 {
  "_id": {
    "$oid": "664b2d5429a4bf79500e5dcf"
  },
  "title": "The Matrix",
  "description": "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
  "runtime": 136,
  "reviews": [
    4,
    5,
    5
  ],
  "__v": 3
}
 ```
#### 5. showing 
   - each document stores data about single showing 
   - start_date includes both date and time
   - format stores data about if film is in 2d, 3d or 4d and if it is subtitled, dubbed, orginal or has voiceover
   - seats object stores data about all seats in hall: row, number, type and info if it is occupied
```js
const showingSchema = new Schema({
    cinema_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: [true, 'Cinema ID is required'],
    },
    movie_id: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie ID is required'],
    },
    movie_name: {
        type: String,
        required: [true, 'Movie name is required'],
    },
    start_date: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    hall_id: {
        type: Schema.Types.ObjectId,
        ref: 'Hall',
        required: [true, 'Hall ID is required'],
    },
    price: {
        standard: {
            type: Number,
            required: [true, 'Standard price is required'],
        },
        vip: {
            type: Number,
            required: [true, 'VIP price is required'],
        },
    },
    format: {
        type: {
            type: String,
            enum: {
                values: ['2D', '3D', '4D'],
                message: 'Format type must be either 2D, 3D, or 4D',
            },
            required: [true, 'Format type is required'],
        },
        language: {
            type: String,
            enum: {
                values: ['subtitled', 'dubbed', 'original', 'voiceover'],
                message: 'Language must be subtitled, dubbed, original, or voiceover',
            },
            required: [true, 'Language is required'],
        }
    },
    seats: {
        type: [seatScheme],
        required: [true, 'Seats are required'],
    },
});

showingSchema.index({ cinema_id: 1, start_date: 1, movie_name: 1 }, { unique: false })
```
```json
{
  "_id": {
    "$oid": "664b934f13a8d8ec6a9051cd"
  },
  "cinema_id": {
    "$oid": "664b18c132cfeae096d90a5b"
  },
  "movie_id": {
    "$oid": "664b2d5429a4bf79500e5dcf"
  },
  "movie_name": "The Matrix",
  "start_date": {
    "$date": "2024-06-07T20:00:00.000Z"
  },
  "hall_id": {
    "$oid": "664b1d6df55c10ffcb7d7f60"
  },
  "price": {
    "standard": 19.99,
    "vip": 28.5
  },
  "format": {
    "type": "3D",
    "language": "dubbed"
  },
  "seats": [
    {
      "row": "A",
      "number": "0",
      "type": "standard",
      "occupied": true
    },
    ...,
    {
      "row": "K",
      "number": "10",
      "type": "vip",
      "occupied": false
    },
    ...,
  ],
  "__v": 0
}
```
#### 6. order
   - stores data about single order
   - order can only include tickets for the same showing
   - stores info about tickets(row, number, type) and total price of tickets
```js
const priceValidator = {
    validator: function (value) {
        return value >= 0;
    },
    message: props => `${props.value} is not a valid price. Please provide a price greater than or equal to 0.`
};


const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required.']
    },
    showing_id: {
        type: Schema.Types.ObjectId,
        ref: 'Showing',
        required: [true, 'Showing ID is required.']
    },
    tickets: {
        type: [seatSchema],
        required: [true, 'At least one ticket is required.']
    },
    total_price: {
        type: Number,
        required: [true, 'Total price is required.'],
        validate: priceValidator,
        default: 0
    }
}, { timestamps: true });
```
```js
const seatScheme = new Schema({
    row: {
        type: String,
        enum: {
            values: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
            message: '{VALUE} is not a valid seat type'
        },
        required: [true, 'Please provide the row of the seat'],
    },
    number: {
        type: String,
        required: [true, 'Please provide the seat number'],
    },
    type: {
        type: String,
        enum: {
            values: ['vip', 'standard'],
            message: '{VALUE} is not a valid seat type'
        },
        default: 'standard',
        required: [true, 'Please provide the type of the seat'],
    },
    occupied: {
        type: Boolean,
        default: false,
    }
},{ _id : false});

orderSchema.index({ showing_id: 1, createdAt: 1 }, {unique: false});
```
```json
{
  "_id": {
    "$oid": "664db4b22412bad31108652e"
  },
  "user_id": {
    "$oid": "664b36c64a0621df2e31dd38"
  },
  "showing_id": {
    "$oid": "664b934f13a8d8ec6a9051cd"
  },
  "tickets": [
    {
      "row": "A",
      "number": "0",
      "type": "standard",
      "occupied": true
    },
    {
      "row": "B",
      "number": "0",
      "type": "standard",
      "occupied": true
    }
  ],
  "total_price": 39.98,
  "createdAt": {
    "$date": "2024-05-22T09:02:42.262Z"
  },
  "updatedAt": {
    "$date": "2024-05-22T09:02:42.262Z"
  },
  "__v": 0
}
```

### Database diagram <div id="diagram"></div>

![](./img/db_diagram.jpg)

### CRUD operation 1 <div id="crud1"></div>
###### Signup user
Endpoint:
```js
POST users/signup
```
Body:
```js
{
    "email": "maciek@gmail.com",
    "password": "admin123"
}
```
Sample result:
```js
{
    "user": {
        "email": "maciek@gmail.com",
        "password": "$2a$12$SjcdMIJdTylkpGYA/uQXI.r85o1cyG1LtTVDM8AEklBANBlmUmJbW",
        "role": "user",
        "cart": {
        "seats": []
        },
        "_id": "664b36c64a0621df2e31dd38",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTI1NSwiZXhwIjoxNzE2NDY0NDU1fQ.6J1fwZsSRNtzMyfcsTf16Bm_osqCNiobVNlnHSu8Rws"
}
``` 
Functions:
```js
//signup
async signup(email, password) {
    try {
        const user = await this.User.create({ email, password });
        return {
            user,
            token: createToken(user)
        };
    } catch (error) {
        throw new AppError(error.message, 400);
    }
}
```
```js
//create token
const createToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, 
        { expiresIn: 3 * 24 * 60 * 60 });
}
```
```js
//trigger- presave password is hashing
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});
```

### CRUD operation 2 <div id="crud2"></div>
###### Update user's password
Endpoint:
```js
PATCH patch/update-password
```
Body:
```js
{
    "oldPassword": "admin123",
    "newPassword": "maciek123"
}
```
Headers:
```js
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTQyNiwiZXhwIjoxNzE2NDY0NjI2fQ.zi0UNmCzz9UcarmtAC-dkWxDEq9VXAHxotJwMNuHVF0
```
Sample result:
```js
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTY2NCwiZXhwIjoxNzE2NDY0ODY0fQ.3HGGX8v6Qw4ULJq6W6B-fjcePXuWGqYoR0l9BXQj7qM"
}
```
Functions:
```js
//update password
async updatePassword(user_id, oldPassword, newPassword) {
    const user = await this.User.findById(user_id);
    if (!user) {
        throw new AppError(`User with id: ${user_id} not found`, 404);
    }
    if (!(await user.isValidPassword(oldPassword))) {
        throw new AppError('Invalid password', 401);
    }

    user.password = newPassword;
    await user.save();

    return {
        token: createToken(user)
    };
}
```
```js
//password validation
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
```

### Transactional operation <div id="transactional"></div>
###### Place an order
Endpoint:
```js
POST /orders
```
Headers:
```js
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTQyNiwiZXhwIjoxNzE2NDY0NjI2fQ.zi0UNmCzz9UcarmtAC-dkWxDEq9VXAHxotJwMNuHVF0
```
Sample result:
```js
{
  "message": "Order created"
}
```
Functions:
```js
//create order
async createOrder(user_id) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await this.User.findById(user_id).session(session);
        if(!user) {
            throw new AppError('User not found', 404);
        }

        const cart = user.cart;
        if(cart.showing_id === null || cart.seats.length === 0) {
            throw new AppError('Cart is empty', 400);
        }

        const showing = await this.Showing.findById(cart.showing_id).session(session);
        if(!showing) {
            throw new AppError('Showing not found', 404);
        }

        const {showing_id, seats, total_price} = await this.showingUtils.checkSeatsAvailability(showing, cart.seats);

        for(let seat of seats) {
            showing.seats.find(s => s.row == seat.row && s.number == seat.number).occupied = true;
        }

        await showing.save({session});

        await this.Order.create([{user_id, showing_id, tickets: seats, total_price}],{session: session});

        user.cart = {showing_id: null, seats: [], total_price: 0};
        await user.save({session});

        await session.commitTransaction();
        session.endSession();           
    } catch(error) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(error, 400);
    }
}
```
```js
//check if any of seats is occupied
async checkSeatsAvailability(showing, seats) {
    try {            
        const showingSeats = showing.seats;
        const showingPrice = showing.price;
        let chosenSeats = [];
        let totalPrice = 0;

        for (let seat of seats) {
            const seatIndex = showingSeats.findIndex(s => s.row == seat.row && s.number == seat.number);
            if (seatIndex === -1) {
                throw new AppError(`Seat ${seat.row}${seat.number} not found`, 404);
            }

            if (showingSeats[seatIndex].occupied) {
                throw new AppError(`Seat ${seat.row}${seat.number} is already occupied`, 400);
            }

            totalPrice += showingPrice[showingSeats[seatIndex].type];
            chosenSeats.push(showingSeats[seatIndex]);
        }

        return { 
            showing_id: showing._id, 
            seats: chosenSeats, 
            total_price: totalPrice.toFixed(2)
        };

    } catch(error) {
        throw new AppError(error, 400);
    }
}
```

### Reporting operation 1<div id="reporting1"></div>
###### Find movies by average review score higher then given
Endpoint:
```js
    GET movies/review/:score
```
Sample result:
```js
[
    {
        "_id": "664b2d5429a4bf79500e5dcf",
        "title": "The Matrix",
        "description": "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
        "runtime": 136,
        "reviews": [4, 5, 5],
        "__v": 3,
        "averageReview": 4.666666666666667
    },
    {
        "_id": "664b2d93e6922309f8189d4d",
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "runtime": 148,
        "reviews": [5, 5, 5],
        "__v": 3,
        "averageReview": 5
    },
    {
        "_id": "664b2d93e6922309f8189d4e",
        "title": "Interstellar",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "runtime": 169,
        "reviews": [5],
        "__v": 1,
        "averageReview": 5
    }
]
```
Functions:
```js
//find movies by average review score
movieSchema.statics.findByAverageReviewScore = function(score) {
    return this.aggregate([
        { $addFields: { averageReview: { $avg: "$reviews" } } },
        { $match: { averageReview: { $gte: score } } }
    ]);
};
```
```js
//get all movies with higher average review score than given
async getMoviesByReviewScore(score) {
    try {
        return await this.Movie.findByAverageReviewScore(score);
    } catch (error) {
        throw new AppError(error, 400);
    }
}
```

### Reporting operation 2<div id="reporting2"></div>
###### Get cinema income in given month for each movie
Endpoint:
```js
GET orders/income/cinema/:cinema_id/month/:month/year/:year/movies
```
Sample result:
```js
{
  "moviesIncome": {
    "The Matrix": 153.98,
    "Inception": 39.98
  },
  "totalIncome": "193.96"
}
```
Functions:
```js
//Get monthly income for each movie in given cinema
async getCinemaMonthlyIncomeForEachMovie(cinema_id, month, year) {
    const showings = await this.Showing.find({cinema_id}).exec();

    const firstDay = new Date(year, month -1, 1);
    firstDay.setHours(23, 59, 59, 9999);
    const lastDay = new Date(year, month, 1);
    lastDay.setHours(0,0,0,1);

    let totalIncome = 0;
    let moviesIncome = {};
    for (let showing of showings) {
        const orders = await this.Order.find({showing_id: showing._id, createdAt: { $gte: firstDay, $lt: lastDay } }).exec();
        for (let order of orders) {
            if(!moviesIncome[showing.movie_name]) {
                moviesIncome[showing.movie_name] = 0;
            }
            moviesIncome[showing.movie_name] += order.total_price;
            totalIncome += order.total_price;
        }
    }
    return {
        moviesIncome,
        totalIncome: totalIncome.toFixed(2)
    };
}
```

### UI demo <div id="demo"></div> //TODO