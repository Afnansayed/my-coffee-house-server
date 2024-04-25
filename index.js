const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khblnbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   // await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const userCollection = client.db('coffeeDB').collection('users');
//get
    app.get('/coffee',async(req,res)=> {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

//get single data
  app.get('/coffee/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result)
  })
 //post
    app.post('/coffee',async(req,res) =>{
        const newCoffee = req.body;
        console.log(newCoffee)
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    })

    //put/update
    app.put('/coffee/:id',async (req,res)=>{
         const coffee = req.body;
         const id = req.params.id;
         const filter = {_id: new ObjectId(id)};
         const options = {upsert: true};
         const updatedCoffee = {
            $set:{
                name: coffee.name,
                quantity:coffee.quantity,
                supplier:coffee.supplier,
                taste:coffee.taste,
                category:coffee.category,
                details:coffee.details,
                photo:coffee.photo
            }
         }
         const result = await coffeeCollection.updateOne(filter,updatedCoffee,options);
         res.send(result)
    })

    //delete
    app.delete('/coffee/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    })

    // user  backend work ......
    //get
    app.get('/users',async(req,res)=> {
        const cursor = userCollection.find() ;
        const result = await cursor.toArray();
        res.send(result)
    })
    //post
    app.post('/users',async (req,res) => {
          const newUser = req.body;
          const result = await userCollection.insertOne(newUser);
          res.send(result);
    })
    //update by patch
    app.patch('/users',async(req,res)=> {
      const updatedUser = req.body;
      const filter = {email: updatedUser.email};
      const options = {upsert:true};
      const updatedDoc = {
        $set:{
          lastSignIn: updatedUser.lastSignIn,
        }
      }
      const result = await userCollection.updateOne(filter,updatedDoc,options);
      res.send(result)
    })
    //delete
    app.delete('/users/:id',async(req,res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await userCollection.deleteOne(query);
          res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) => {
    res.send('My coffee house is the best for coffee');
})

app.listen(port, () => {
    console.log(`Coffee house server is running on port  ${port}`)
})