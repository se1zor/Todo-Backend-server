import express from 'express'
import { PORT, MongoDBURL } from './config.js'
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb"
const app = express()




app.use(express.json()) //converts any incoming data into json

const client = new MongoClient(MongoDBURL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const todoDB = client.db("Todo")
const mylist = todoDB.collection("Todolist")


app.listen(PORT, ()=> {
    console.log (`Server started on port ${PORT}`) 
    
   
})
//res- data going to the client
//req- is data copming in from the client


app.get('/', (req, res) => {
    return res.status(200).send("<h1>Hello there, how are you?!</h1>")
})

app.get('/mylist', (req, res) => {
    // route show all books
    mylist.find().toArray()
        .then(response => {
            // console.log(response)
            res.status(200).send(response)
        })
        .catch(err => console.log(err))
    // return res.status(200).send("<a href='/'> Home</a>")
})

app.get('/mylist/:id', (req, res) => {
    // route show a specific book
    const data = req.params

    const filter = {
        "_id": new ObjectId(data.id)
    }

    mylist.findOne(filter)
        .then(response => {
            // console.log(response)
            res.status(200).send(response)
        })
        .catch(err => console.log(err))
    // return res.status(200).send(`<a href='/'> Book: ${data.id}</a>`)
})

app.post('/admin/savetodo', (req, res) => {
    // Route to add a new todo
    const data = req.body
    if (!data.Title)
        return res.status(400).send("No Title found.")
    if (!data.Todo)
        return res.status(400).send("No Todo found.")
    if (!data.TodoDate)
        return res.status(400).send("No Todo Date found.")
       


    mylist.insertOne(data)
    .then(response=>{
        return res.status(201).send(JSON.stringify(response))
    })
    .catch(err=>console.log(err))
})

app.delete('/admin/remove/:id', (req, res) => {
    const data = req.params

    const filter = {
        "_id": new ObjectId(data.id)
    }

    mylist.deleteOne(filter)
        .then(response => {
            // console.log(response)
            return res.status(200).send(response)
        })
        .catch(err => console.log(err))
})

app.put('/admin/update/:id/', (req, res) => {
    const data = req.params
    const docData = req.body
    
    const filter = {
        "_id": new ObjectId(data.id)
    }

    const updDoc = {
        $set: {
           ...docData //docData.price, docData.cover
        }
    }

    mylist.updateOne(filter, updDoc)
    .then(response=>{
        res.status(200).send(response)
    })
    .catch(err=>console.log(err))
})