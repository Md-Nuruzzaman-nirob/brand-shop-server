import express from 'express';
import cors from 'cors';
import {
    MongoClient,
    ServerApiVersion,
    ObjectId
} from 'mongodb';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 5001;


dotenv.config();
// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://brand-shop-server-ecru.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jhq5gsc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// middleware
const logger = (req, res, next) => {
    console.log(req.method, req.url, );
    next()
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).send({
            message: 'unauthorize access'
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'unauthorize access'
            })
        }
        req.user = decoded
        next()
    })
}

async function run() {
    try {
        // JWT Authentication
        app.post('/jwt', async (req, res) => {
            try {
                const user = req.body;
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '2h'
                });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                }).send({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });

        // Logout
        app.post('/logout', async (req, res) => {
            try {
                res.clearCookie('token').send({
                    success: true
                });
            } catch (error) {
                next(error);
            }
        });


        // ====>product<====
        const productsCollection = client.db("productsDB").collection("products");


        // get || read
        app.get('/products', async (req, res) => {
            // if (req.user.email !== req.query.email && req.query.email) {
            //     return res.status(403).send({
            //         message: 'forbidden access'
            //     })
            // }
            // let query = {};

            // if (req.query.email) {
            //     query = {
            //         email: req.query.email
            //     }
            // }
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        // get || read
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })


        // get one || read one
        app.get('/products/:id', async (req, res) => {
            // if (req.user.email !== req.query.email && req.query.email) {
            //     return res.status(403).send({
            //         message: 'forbidden access'
            //     })
            // }
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
            // if (req.user.email !== req.query.email && req.query.email) {
            //     return res.status(403).send({
            //         message: 'forbidden access'
            //     })
            // }
            const query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        // get || read
        app.get('/carts', async (req, res) => {
            const result = await cartCollection.find().toArray()
            res.send(result)
        })


        // get one || read one
        app.get('/carts/:id', async (req, res) => {
            // if (req.user.email !== req.query.email && req.query.email) {
            //     return res.status(403).send({
            //         message: 'forbidden access'
            //     })
            // }
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