const express = require('express');
const app = express()
const cors = require('cors');
require("dotenv").config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');

const port = process.env.PORT || 5001

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jhq5gsc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const productsCollection = client.db("productsDB").collection("products");

        // get || read
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        // get one || read one
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        // post || create
        app.post('/products', async (req, res) => {
            const newProduct = req.body
            const result = await productsCollection.insertOne(newProduct)

            res.send(result)
        })

        // put one || update one
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const updatedProduct = req.body
            const filter = {
                _id: new ObjectId(id)
            }
            const updateProduct = {
                $set: {

                }
            }
            const option = {
                upsert: true
            }
            const result = await productsCollection.updateOne(filter, updateProduct, option)
            res.send(result)
        })

        // delete one
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({
        //     ping: 1
        // });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('is this working? yes!!!')
})

app.listen(port, () => {
    console.log('port is running on', port);
})