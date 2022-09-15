const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster1.helve.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  await client.connect()
  try {
    const bennerCollection = client.db('DigitalMenu').collection('bannerItems');
    const productCollection = client.db('DigitalMenu').collection('AllFoods');
    const ordersCollection = client.db('DigitalMenu').collection('orderCollection');
    // banner Items  
    app.get('/bannerItems', async (req, res) => {
      const query = {};
      const cursor = bennerCollection.find(query);
      const allItems = await cursor.toArray();
      res.send(allItems)
    });
    app.get('/allFoods', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const allItems = await cursor.toArray();
      res.send(allItems)
    });
    
    app.get('/search/:key', async(req, res) => {
        const result = req.params.key;
          const query = { title: "result" }
          const orders = await productCollection.find(query);
          res.send(orders)
        
    })  

    app.get('/food/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const purchaseProduct = await productCollection.findOne(query);
      res.send(purchaseProduct);

    });

    app.get('/orderparts', async (req, res) => {
      const query = {};
      const cursor = ordersCollection.find(query);
      const order = await cursor.toArray();
      res.send(order)
    });

    app.post('/customerOrder', async (req, res) => {
      const newProduct = req.body;
      const result = await ordersCollection.insertOne(newProduct);
      res.send(result);


    });
    
       
    

  } finally {

  }
}
run().catch(console.dir())

app.get('/', (req, res) => {
  res.send('server is running');
});

app.listen(port, () => {
  console.log('listing port is', port)
})