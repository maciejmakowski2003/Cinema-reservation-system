# Cinema reservation system

## Authors: 
- Maciej Makowski
- Franciszek Job

## Tech stack:
- MongoDB
- Node.js(Express)
- React(Ts)

[Link to github](https://github.com/maciejmakowski2003/Cinema-reservation-system)

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
    "halls": [
        "1": {
            "rows": [
                {
                    "row_number": "A",
                    "seats_number": 30
                },
                {
                    "row_number": "B",
                    "seats_number": 30
                }
            ]
        }
    ]
   }
   ```
3. film
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
4. showing
   - each document stores data about single showing 
    ```js
    {
        "_id": ObjectId
        "cinema_id": ObjectId, 
        "film_id": ObjectId,
        "start_date": Date, //includes both date and time
        "hall": 3
        "seats": [
            {
                "row_number": "A",
                "seat_number": 15,
                "price": 21.99,
                "occupied": false
            },
            {
                "row_number": "F",
                "seat_number": 17,
                "price": 21.99,
                "occupied": true
            }
        ]
    }
    ```
5. order
   ```js
   {
    "user_id": ObjectId,
   }
   ```