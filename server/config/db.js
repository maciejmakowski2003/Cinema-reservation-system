module.exports = function (mongoose) {
    mongoose
        .connect("mongodb+srv://admin_cinema:pusteniebo99@cluster.lp3lhuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster", {
            dbName: 'cinema_reservation_system',
        })
        .then(() => {
            console.log('MongoDB connected successfully.');
        })
        .catch(err => console.error(err));
};