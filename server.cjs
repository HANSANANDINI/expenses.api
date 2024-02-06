

const express = require('express')

// Importing required functions from dbConnection.cjs
const {connectToDb, getDb} = require('./dbconnection.cjs')
const{ObjectId} = require('mongodb')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else {
        app.listen(8000)
        db = getDb()
        console.log('Listening on port 8000...')
    }
})

app.post('/add-entry', function(request, response) {
    db.collection('expensesdatabase').insertOne(request.body).then(function() {
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})

app.get('/get-entries', function(request, response) {
    // Declaring an empty array
    const entries = []
    db.collection('expensesdatabase')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function() {
        response.status(404).json({
            "status" : "Could not fetch documents"
        })
    })
})

app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('expensesdatabas').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})


app.patch('/update-entry/:id', function(request, response) {
    if(ObjectId.isValid(request.params.id)) {
        db.collection('expensesdatabase').updateOne(
            { _id : new ObjectId(request.params.id) }, 
            { $set : request.body } 
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})