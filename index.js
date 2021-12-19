const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;


app.use(bodyParser.json());
app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://bakery-shop:M5pERxHZtzAVH1fr@cluster0.fzvfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('bakery');
        const usersCollection = database.collection('users')
        const cakeCollection = database.collection('cake')
        const donutCollection = database.collection('donut')
        const muffinCollection = database.collection('muffin')
        const pieCollection = database.collection('pie')
        const waffleCollection = database.collection('waffle')
        const cupCakeCollection = database.collection('cupcake')
        const productsCollection = database.collection('products')
        const purchaseCollection = database.collection('purchase')
        const reviewCollection = database.collection('review')



        app.post('/users', async (req, res) => {
            console.log('hitting');
            res.send('hit the post')
        })



        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result)
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;

            }
            res.json({ admin: isAdmin })

        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', req.headers.authorization);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })




        app.get('/purchase', async (req, res) => {
            const email = req.query.email;
            const quary = { email: email }
            const cursor = purchaseCollection.find(quary)
            const listsItems = await cursor.toArray();
            console.log(listsItems);
            res.send(listsItems)
        })
        // get api for a single service

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);

        });

        app.post('/purchase', async (req, res) => {
            const newPerchase = req.body;
            console.log('hitted', newPerchase);
            const result = await purchaseCollection.insertOne(newPerchase);

            res.json(result)
        });

        // app.delete('/parches/:_id', (req, res) => {
        //     perchaseCollection.deleteOne({ _id: ObjectId(req.params._id) })
        //         .then((result) => {
        //             res.send(result.deletedCount > 0)
        //         })
        // })




        // collections

        app.get('/cake', async (req, res) => {
            const cursor = cakeCollection.find({})
            const cake = await cursor.toArray();

            res.send(cake)
        })
        app.get('/donut', async (req, res) => {
            const cursor = donutCollection.find({})
            const donut = await cursor.toArray();

            res.send(donut)
        })
        app.get('/muffin', async (req, res) => {
            const cursor = muffinCollection.find({})
            const muffin = await cursor.toArray();

            res.send(muffin)
        })
        app.get('/pie', async (req, res) => {
            const cursor = pieCollection.find({})
            const pie = await cursor.toArray();

            res.send(pie)
        })
        app.get('/waffle', async (req, res) => {
            const cursor = waffleCollection.find({})
            const waffle = await cursor.toArray();

            res.send(waffle)
        })
        app.get('/cupcake', async (req, res) => {
            const cursor = cupCakeCollection.find({})
            const cupcake = await cursor.toArray();

            res.send(cupcake)
        })
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray();

            res.send(products)
        })










        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json(result)
        });



        // app.delete('/delete/:_id', (req, res) => {
        //     reviewCollection.deleteOne({ _id: ObjectId(req.params._id) })
        //         .then((result) => {
        //             res.send(result.deletedCount > 0)
        //         })
        // })



        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({})
            const product = await cursor.toArray();

            res.send(product)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running')
})

app.listen(port, () => {
    console.log('server running at port');
})
