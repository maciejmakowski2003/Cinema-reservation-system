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
   {
    "_id": ObjectId, 
    "email": "adam@gmail.com",
    "password": "hashedpassowrd"
   }
   ```

2. cinema
   - each document represents single cinema.
   - if it is open on particular day, field open and close will contain hours. if not, they will be set to closed.
   ```js
   {
    "_id": ObjectId, 
    "name": "Multikino",
    "phone": "+48556752999", 
    "address": {
        "street": "Bora Komorowskiego 13",
        "city": "Kraków",
        "state": "małopolska",
        "country": "Polska",
        "zipcode": "31116"
    },
    "opening_hours": {
        "monday": {
            "open": "09:00", 
            "close": "22:00"
        },
        "sunday": {
            "open": "closed", 
            "close": "closed"
        }
    },
    "halls": List<ObjectId>
   }
   ```
3. hall
   - each document represent single hall
   - each seat can be standard or vip
   ```js
   {
    "_id": ObjectId,
    "cinema_id": ObjectId,
    "seats": [
        {
            "row": "A",
            "seat_number": 15
            "type": "standard"
        },
        {
            "row": "F",
            "seat_number": 15
            "type": "vip"
        }
    ]
   }
   ```

4. movie
   - each document stores data about single movie
   - reviews from 1 to 10 
   - runtime in minutes
   ```js
   {
    "_id": ObjectId,
    "name": "Incepcja",
    "description": "description",
    "runtime": 123,
    "reviews": [7,7,10,7,10,10]
   }
   ```
5. showing
   - each document stores data about single showing 
   - start_date includes both date and time
   - format stores data about if film is in 2d or 3d and if it has voiceover, subtitles or dubbing
   - seats object stores data about all seats in hall: row, number, type and info if it is occupied
    ```js
    {
        "_id": ObjectId
        "cinema_id": ObjectId, 
        "movie_id": ObjectId,
        "start_date": Date, 
        "hall": 3,
        "price": {
            "standard": 17.99,
            "vip": 25.99
        },
        "format": {
            "type": "2D",
            "language": "voiceover"
        },
        "seats": [
            {
                "row_number": "A",
                "seat_number": 15,
                "type": "standard",
                "occupied": false
            },
            {
                "row": "F",
                "seat_number": 17,
                "type": "vip",
                "occupied": true
            }
        ]
    }
    ```
6. order
   - stores data about single order
   - order can only include tickets for the same showing
   - stores info about tickets(row, number, type) and total price of tickets
   ```js
   {
    "_id": ObjectId,
    "user_id": ObjectId,
    "showing_id": ObjectId,
    "tickets":[
        {
            "row": "F",
            "seat_number": 15,
            "type": "vip"
        },
        {
            "row": "F",
            "seat_number": 16,
            "type": "vip"
        }
    ],
    "total_price": 51.98
   }
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