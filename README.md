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
   - each document stores information about single user 
   ```js
   {
    "_id": ObjectId, 
    "username": "adam_kowalski",
    "email": "adam@gmail.com",
    "password": "hashedpassowrd", 
   }
   ```

2. cinema
   - each document represents cinema
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
    }
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

4. film
 - each document stores data about film and its reviews
   ```js
   {
    "_id": ObjectId,
    "name": "Incepcja",
    "description": "description",
    "runtime": "123 min",
    "reviews": [7,7,10,7,10,10]//from 1 to 10
   }
   ```
5. showing
   - each document stores data about single showing 
    ```js
    {
        "_id": ObjectId
        "cinema_id": ObjectId, 
        "film_id": ObjectId,
        "start_date": Date, //includes both date and time
        "hall": 3,
        "price": {
            "standard": 17.99,
            "vip": 25.99
        },
        "format": {
            "type": "2D",
            "language": "voiceover"//voiceover, dubbing or subtitles
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
- CRUD cinema, film, hall, showing, user
- place an order(update seats occupation to true, create order)
- monthly income for each cinema and total
- showtimes for each day in each cinema
- showings for each film in each cinema
- access control to available seats