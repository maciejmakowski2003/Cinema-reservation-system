# Cinema reservation system

## Authors: 
- Maciej Makowski
- Franciszek Job

## Tech stack:
- MongoDB
- Node.js(Express)
- React(Ts)

[github](https://github.com/maciejmakowski2003/Cinema-reservation-system)

### DB scheme 

1. user
   - each document stores information about single user.
   ```js
    const userSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        }
    });
   ```

2. cinema
   - each document represents single cinema.
   - if it is open on particular day, field open and close will contain hours. if not, they will be set to closed.
   ```js
    const cinemaSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipcode: String,
        },
        opening_hours: {
            type: openingHoursSchema,
            required: true,
        },
        halls: {
            type: [Schema.Types.ObjectId],
            ref: 'Hall',
            default: [],
        }
    });

    const openingHoursSchema = new Schema({
        monday: {
            open: String,
            close: String,
        },
        tuesday: {
            open: String,
            close: String,
        },
        wednesday: {
            open: String,
            close: String,
        },
        thursday: {
            open: String,
            close: String,
        },
        friday: {
            open: String,
            close: String,
        },
        saturday: {
            open: String,
            close: String,
        },
        sunday: {
            open: String,
            close: String,
        }
    });
   ```
3. hall
   - each document represent single hall
   - each seat can be standard or vip
   ```js
    const hallSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        cinema_id: {
            type: Schema.Types.ObjectId,
            ref: 'Cinema',
            required: true,
        },
        seats: {
            type: [seatScheme],
            required: true,
        }
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

4. movie
   - each document stores data about single movie
   - reviews from 1 to 10 
   - runtime in minutes
   ```js
    const validateReview = {
        validator: function (value) {
            return value.every(score => score >= 1 && score <= 10 && Number.isInteger(score));
        },
        message: props => `${props.value} is not a valid review score. Please provide a score between 1 and 10.`
    };



    const movieSchema = new Schema({
        title: {
            type: String,
            required: true,
        },
        description: String,
        runtime: Number,
        reviews: {
            type: [Number],
            required: true,
            default: [],
            validate: validateReview,
        }
    });
   ```
5. showing
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
6. order
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

### Opreations on DB
- CRUD cinema, film, hall, showing(only on backend)
- CRUD user
- place an order(update seats occupation to true, create order)
- avg review of movie
- monthly income for each cinema and total
- showtimes for each day in each cinema
- showings for each film in each cinema
- access control to available seats