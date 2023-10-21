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

        // ------>product<------
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

        // post one || create one 
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
                    brandName: updatedProduct.brandName,
                    name: updatedProduct.name,
                    imageUrl: updatedProduct.imageUrl,
                    category: updatedProduct.category,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    message: updatedProduct.message,
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


        // ------>Cart<------
        const cartCollection = client.db("cartDB").collection("carts");

        // get || read
        app.get('/carts', async (req, res) => {
            const result = await cartCollection.find().toArray()
            res.send(result)
        })

        // get one || read one
        app.get('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await cartCollection.findOne(query)
            res.send(result)
        })

        // post one || create one 
        app.post('/carts', async (req, res) => {
            const newCart = req.body
            const result = await cartCollection.insertOne(newCart)

            res.send(result)
        })

        // put one || update one
        app.put('/carts/:id', async (req, res) => {
            const id = req.params.id
            const updatedCart = req.body
            const filter = {
                _id: new ObjectId(id)
            }
            const updateProduct = {
                $set: {
                    brandName: updatedCart.brandName,
                    name: updatedCart.name,
                    imageUrl: updatedCart.imageUrl,
                    category: updatedCart.category,
                    price: updatedCart.price,
                    rating: updatedCart.rating,
                    message: updatedCart.message,
                }
            }
            const option = {
                upsert: true
            }
            const result = await cartCollection.updateOne(filter, updateProduct, option)
            res.send(result)
        })

        // delete one
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('is this working? yes!!!')
})

app.listen(port, () => {
    console.log('port is running on', port);
})