module.exports = function (mongoose) {
    mongoose
        .connect(process.env.MONGO_URI, {
            dbName: 'cinema_reservation_system',
        })
        .then(() => {
            console.log('MongoDB connected successfully.');
        })
        .catch(err => console.error(err));
};