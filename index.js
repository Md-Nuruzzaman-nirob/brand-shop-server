import express, {
    json
} from 'express';
const app = express()
import cors from 'cors';
import {
    MongoClient,
    ServerApiVersion,
    ObjectId
} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const port = process.env.PORT || 5001

// middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(json())
app.use(cookieParser())

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
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            })
            res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                .send({
                    success: true
                })
        })

        app.post('/logout', async (req, res) => {
            // const user = req.body
            // console.log(user);
            res.clearCookie('token', {
                maxAge: 0
            }).send({
                success: true,
            })
        })

        // ====>product<====
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


        // ====>Cart<====
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
    } finally {}
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('is this working? yes!!!')
})

app.listen(port, () => {
    console.log('port is running on', port);
})