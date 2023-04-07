const express = require('express')
const port = 3000
const app = express()
const uuid = require('uuid')
app.use(express.json())

const orders = []

const methodAndUrl = (request, response, next) => {
    console.log(request.method, request.url)

    next()
}

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.post('/orders',methodAndUrl, (request, response) => {
    const {order, clientName, price, status} = request.body
    const newOrder = { id: uuid.v4(), order, clientName, price, status}

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.put('/orders/:id',methodAndUrl, checkUserId, (request, response) => {
    const {order, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id',methodAndUrl, checkUserId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/orders/:id',methodAndUrl, checkUserId, (request, response) => {
    const {order, clientName, price,status} = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder
    return response.json(updateOrder)
})

app.listen(port, () => {
    console.log(`server started on port ${port} 😊`)
})