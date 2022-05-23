const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config()

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dctmt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const productsCollection = client.db('grocery').collection('inventory')
        // const orderCollection = client.db('grocery').collection('order')
        //get
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await productsCollection.findOne(query);
            res.send(service);
        })
      
        //delete
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        //POST
        app.post('/inventory', async (req, res) => {
            const newService = req.body;
            const result = await productsCollection.insertOne(newService);
            res.send(result);
        });
        //update
        app.put('/inventory/:id', async (req, res) => {
            const id = req?.params?.id;
            const UpdateService = req?.body;
            // console.log(typeof UpdateService.quantity);
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const update = {
                $set: {
                    quantity: UpdateService.quantity,
                }
            };
            const result = await productsCollection.updateOne(filter, update, option);
            res.send(result);

        })

        app.get("/myItem/:email",async(req,res)=>{
            const email=req.params;
            // console.log(email);
            // const query={email};
            const cursor=productsCollection.find(email)
            const products=await cursor.toArray()
            res.send(products)
        })
        app.post('/addItem', async (req, res) => {
            const newService = req.body;
            const result = await productsCollection.insertOne(newService);
            res.send(result);
        });
        // app.get('/order', async (req, res) => {
        //     const email=req.query.email
        //     console.log(email);
        //     const query = {email:email}
        //     const cursor = orderCollection.find(query);
        //     const services = await cursor.toArray();
        //     res.send(services);
        // })
        // app.post('/order', async (req, res) => {
        //     const order = req.body;
        //     const result = await orderCollection.insertOne(order);
        //     res.send(result);
        // })

    }finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my node CRUD server')
})

app.listen(port, () => {
    console.log('crud server is running ');
})