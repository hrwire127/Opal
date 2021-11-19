const mongoose = require('mongoose');
const Estate = require('../models/estate')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/Opal', {
    useNewUrlParser: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>
{
    console.log("connected to db --- main");
});

const sample = (array) =>
{
    return array[Math.floor(Math.random() * array.length)]; //1000 cities
}


const seedDB = async () =>
{
    await Estate.deleteMany({});
    for (let i = 0; i < 10; i++)
    {
        const randnum = Math.floor(Math.random() * 1000); //1000 cities
        const price = Math.floor(Math.random() * 200000) + 10;
        const estate = new Estate({
            location: `${cities[randnum].city}, ${cities[randnum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dnu6yyl9d/image/upload/v1636809634/Opal/anqa08zyht82uiv8wb7x.jpg',
                    filename: 'Opal/anqa08zyht82uiv8wb7x'
                },
                {
                    url: 'https://res.cloudinary.com/dnu6yyl9d/image/upload/v1636809635/Opal/jid4qim6qozvzi4bvi8j.jpg',
                    filename: 'Opal/jid4qim6qozvzi4bvi8j'
                }
            ],
            geometry: { type: 'Point', coordinates: [cities[randnum].longitude, cities[randnum].latitude] },
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde odio vero culpa sint alias, necessitatibus quasi aspernatur, veritatis optio qui blanditiis ad at sapiente rem fugiat, ut voluptatibus autem porro!",
            price: price,
            author: "618e8a7be3e728ac090b0318"
        })
        await estate.save();
    }
}


seedDB();