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
2. [Database operations](#operations)
3. [Endpoints](#endpoints)

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
#### 4. movie
   - each document stores data about single movie
   - reviews from 1 to 10 
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
   ```
#### 5. showing //TODO
   - each document stores data about single showing 
   - start_date includes both date and time
   - format stores data about if film is in 2d, 3d or 4d and if it is subtitled, dubbed, orginal or has voiceover
   - seats object stores data about all seats in hall: row, number, type and info if it is occupied
   ```js
    const showingSchema = new Schema({
        cinema_id: {
            type: Schema.Types.ObjectId,
            ref: 'Cinema',
            required: true,
        },
        movie_id: {
            type: Schema.Types.ObjectId,
            ref: 'Movie',
            required: true,
        },
        start_date: {
            type: Date,
            required: true,
        },
        hall_id: {
            type: Schema.Types.ObjectId,
            ref: 'Hall',
            required: true,
        },
        price: {
            standard: {
                type: Number,
                required: true,
            },
            vip: {
                type: Number,
                required: true,
            },
        },
        format: {
            type: {
                type: String,
                enum: ['2D', '3D', '4D'],
                required: true,
            },
            language: {
                type: String,
                enum: ['subtitled', 'dubbed', 'original', 'voiceover'],
                required: true,
            }
        },
        seats: {
            type: [seatScheme],
            required: true,
        },
    });

    const seatScheme = new Schema({
        row: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['vip', 'standard'],
            required: true,
        },
        occupied: Boolean,
    });
    ```
#### 6. order //TODO
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
            required: true,
        },
        showing_id: {
            type: Schema.Types.ObjectId,
            ref: 'Showing',
            required: true,
        },
        tickets: {
            type: [seatScheme],
            required: true,
        },
        total_price: {
            type: Number,
            required: true,
            validate: priceValidator,
        },
    },{timestamps: true});
   ```

### Database operations <div id="operations"></div>
#### 1. user
```js
   //password is hashed before saving to db
   userSchema.pre('save', async function(next) {
        if(this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 12);
        }
        next();
    });
```
```js
   userSchema.methods.isValidPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };
```

```js
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
    async login(email, password) {
        const user = await this.User.findOne({ email }).select('+password');
        if (!user) throw new AppError('User not found', 404);
        if (!(await user.isValidPassword(password))) throw new AppError('Invalid email or password', 401);

        return {
            user,
            token: createToken(user)
        };
    }
```
```js
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
    async getCart(user_id) {
        const user = await this.User.findById(user_id).select('cart');
        if (!user) {
            throw new AppError(`User with id: ${user_id} not found`, 404);
        }

        return user.cart;
    }
```
```js
    async addToCart(user_id, showing_id, seats) {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            const user = await this.User.findById(user_id).session(session);
            if (!user) {
                throw new AppError(`User with id: ${user_id} not found`, 404);
            }
    
            const showing = await this.Showing.findById(showing_id).session(session);
            if (!showing) {
                throw new AppError(`Showing with id: ${showing_id} not found`, 404);
            }
    
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
    
            user.cart = { showing_id, seats: chosenSeats, total_price: totalPrice.toFixed(2)};
            await user.save({ session });
    
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError(error, 400);
        }
    }
```
#### 2. cinema
```js
   async createCinema(name, email, address, hours) {
        try {
            const opening_hours = this.generateOpeningHours(hours);
            const cinema = await this.Cinema.create({ name, email, address, opening_hours });
            return cinema;
        } catch (error) {
            throw new AppError(error, 400);
        }
    }
```
```js
   async createAndAddHall(name, cinema_id, rows, seatsPerRow) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newHall = await this.hallUtils.createHall(name, cinema_id, rows, seatsPerRow);
            const savedHall = await newHall.save({ session });

            await this.Cinema.findByIdAndUpdate(
                cinema_id,
                { $push: { halls: savedHall._id } },
                { new: true, session }
            );

            await session.commitTransaction();
            session.endSession();
        } catch(error) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError(error, 400);
        }
    }
```
#### 3. hall
```js
   async createHall(name, cinema_id, rows, seatsPerRow) {
        try {
            const seats = this.generateSeats(rows, seatsPerRow);
            const hall = new this.Hall({
                name,
                cinema_id,
                seats,
            });
            return hall;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }
```
```js
   //only for creating purposes
   async changeSeatType(hall_id, row, number, type) {
        try {
            const hall = await this.Hall.findById(hall_id);
            const seat = hall.seats.find(seat => seat.row == row && seat.number == number);
            seat.type = type;
            await hall.save();
        } catch (error) {
            throw new AppError(error, 400);
        }
    }
```
#### 4. movie 
```js
   movieSchema.statics.findByAverageReviewScore = function(score) {
        return this.aggregate([
            { $addFields: { averageReview: { $avg: "$reviews" } } },
            { $match: { averageReview: { $gte: score } } }
        ]);
    };
```
```js
   async createMovie(title, description, runtime) {
        try {
            await this.Movie.create({ title, description, runtime });
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }
```
```js
   async addReview(movie_id, score) { 
        try {
            const movie = await this.Movie.findById(movie_id);
            movie.reviews.push(score);
            await movie.save();
        } catch (error) {
            throw new AppError(error, 400);
        }
    }
```
```js
   async getMoviesByReviewScore(score) {
        try {
            return await this.Movie.findByAverageReviewScore(score);
        } catch (error) {
            throw new AppError(error, 400);
        }
    }
```
#### 5. showing //TODO
#### 6. order //TODO


### Endpoints
#### 1. user
```js
   API_ROUTE = /users
```
##### Signup
 Endpoint:
```js
    POST ${API_ROUTE}/signup
```
Body:
```js
{
    "email": "maciek@gmail.com",
    "password": "admin123"
}
```
Result:
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

##### Login
Endpoint:
```js
    POST ${API_ROUTE}/login
```
Body:
```js
{
    "email": "maciek@gmail.com",
    "password": "admin123"
}
```
Result:
```js
{
    "user": {
        "cart": {
        "seats": []
        },
        "_id": "664b36c64a0621df2e31dd38",
        "email": "maciek@gmail.com",
        "password": "$2a$12$SjcdMIJdTylkpGYA/uQXI.r85o1cyG1LtTVDM8AEklBANBlmUmJbW",
        "role": "user",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTQyNiwiZXhwIjoxNzE2NDY0NjI2fQ.zi0UNmCzz9UcarmtAC-dkWxDEq9VXAHxotJwMNuHVF0"
    }
```

##### Update password
Endpoint:
```js
    PATCH ${API_ROUTE}/update-password
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
Result:
```js
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTY2NCwiZXhwIjoxNzE2NDY0ODY0fQ.3HGGX8v6Qw4ULJq6W6B-fjcePXuWGqYoR0l9BXQj7qM"
}
```

##### Get cart
Endpoint:
```js
    GET ${API_ROUTE}/cart
```
Headers:
```js
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTQyNiwiZXhwIjoxNzE2NDY0NjI2fQ.zi0UNmCzz9UcarmtAC-dkWxDEq9VXAHxotJwMNuHVF0
```
Result:
```js
{
    "showing_id": null,
    "seats": []
}
```

##### Add to cart //TODO
Endpoint:
```js
    POST ${API_ROUTE}/cart
```
Body:
```js
{
    
}
```
Headers:
```js
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGIzNmM2NGEwNjIxZGYyZTMxZGQzOCIsImlhdCI6MTcxNjIwNTQyNiwiZXhwIjoxNzE2NDY0NjI2fQ.zi0UNmCzz9UcarmtAC-dkWxDEq9VXAHxotJwMNuHVF0
```
Result:
```js

```
#### 2. cinema
```js
API_ROUTE = /cinemas
```

##### Get cinemas
Endpoint:
```js
    GET ${API_ROUTE}
```
Result:
```js
[
    {
        "_id": "664b18c132cfeae096d90a5b",
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
        "664b1d6df55c10ffcb7d7f60",
        "664b1e4483963d55d52f5a1f"
        ],
        "__v": 0
    },
    {
        "_id": "664b1940b2b38c5646fd7c57",
        "name": "Multikino Warszawa Nowy Świat",
        "email": "multikinowarszawanowyswiat@gmail.com",
        "address": {
        "street": "ul.Nowy Świat 24",
        "city": "Warszawa",
        "state": "mazowieckie",
        "country": "Polska",
        "zipcode": "30-243"
        },
        "opening_hours": {
        "monday": {
            "open": "08:00",
            "close": "00:00"
        },
        "tuesday": {
            "open": "08:00",
            "close": "00:00"
        },
        "wednesday": {
            "open": "08:00",
            "close": "00:00"
        },
        "thursday": {
            "open": "08:00",
            "close": "00:00"
        },
        "friday": {
            "open": "08:00",
            "close": "00:00"
        },
        "saturday": {
            "open": "08:00",
            "close": "00:00"
        },
        "sunday": {
            "open": "08:00",
            "close": "00:00"
        }
        },
        "halls": [],
        "__v": 0
    }
]
```
#### 3. movie
```js
API_ROUTE = /movies
```

##### Get movies
Endpoint:
```js
    GET ${API_ROUTE}
```
Result:
```js
[
    {
        "_id": "664b2d5429a4bf79500e5dcf",
        "title": "The Matrix",
        "description": "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
        "runtime": 136,
        "reviews": [
        4,
        5,
        5
        ],
        "__v": 3
    },
    {
        "_id": "664b2d93e6922309f8189d4d",
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "runtime": 148,
        "reviews": [
        5,
        5,
        5
        ],
        "__v": 3
    },
    {
        "_id": "664b2d93e6922309f8189d4e",
        "title": "Interstellar",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "runtime": 169,
        "reviews": [
        5
        ],
        "__v": 1
    },
    {
        "_id": "664b2d93e6922309f8189d4f",
        "title": "The Dark Knight",
        "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "runtime": 152,
        "reviews": [],
        "__v": 0
    }
]
```
##### Add review
Endpoint:
```js
    POST ${API_ROUTE}/review
```
Body:
```js
{
    "movie_id": "664b2d93e6922309f8189d4f",
    "score": "4"
}
```
Result:
```js
{
    "message": "Review added"
}
```
##### Get movies with average review score higher than
Endpoint:
```js
    GET ${API_ROUTE}/review/:score
```

Result:
```js
[
    {
        "_id": "664b2d5429a4bf79500e5dcf",
        "title": "The Matrix",
        "description": "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
        "runtime": 136,
        "reviews": [
        4,
        5,
        5
        ],
        "__v": 3,
        "averageReview": 4.666666666666667
    },
    {
        "_id": "664b2d93e6922309f8189d4d",
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "runtime": 148,
        "reviews": [
        5,
        5,
        5
        ],
        "__v": 3,
        "averageReview": 5
    },
    {
        "_id": "664b2d93e6922309f8189d4e",
        "title": "Interstellar",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "runtime": 169,
        "reviews": [
        5
        ],
        "__v": 1,
        "averageReview": 5
    }
]
```

   

### TODO
- CRUD movie, showing(only on backend)
- place an order(update seats occupation to true, create order)
- monthly income for each cinema and total
- showtimes for each day in each cinema
- showings for each film in each cinema
- access control to available seats
