import request from 'supertest';
import { expect } from "chai"
import { app } from '../src/app.js';
import { Provider } from '../src/models/provider.js';
import { Customer } from '../src/models/customer.js';
import { Furniture } from '../src/models/furniture.js';
import { Transaction } from '../src/models/transaction.js';


let secondCustomerId: string;
const secondCustomer = {
  name: "Juan1",
  surname: "Pérez1",
  telephoneNumber: "+346638902751",
  email: "juanillo1@example.com",
  address: "Calle Principal1",
  postalCode: 123451,
  city: "Ciudad Ejemplo1",
  gender: "Male",
  nif: "12345678C1"
}

let thirdCustomerId: string;
const thirdCustomer = {
  name: "Juan2",
  surname: "Pérez2",
  telephoneNumber: "+346638902752",
  email: "juanillo2@example.com",
  address: "Calle Principal2",
  postalCode: 123452,
  city: "Ciudad Ejemplo2",
  gender: "Male",
  nif: "12345678C2"
}


let secondFurnitureId: string;
const secondFurniture = {
  name: "Sofá Chesterfield1",
  description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.1",
  category: "Sofás1",
  dimensions: "200x30x101",
  materials: ["Cuero genuino1", "Madera de noga1l"],
  color: "Marron1",
  style: "Clásico1",
  price: 300,
  imageUrl: "https://example.com/sofa.jpg1",
  quantity: 11
}

beforeEach(async () => {
  await Transaction.deleteMany();
  secondCustomerId = (await new Customer(secondCustomer).save())._id;
  secondFurnitureId = (await new Furniture(secondFurniture).save())._id;
  thirdCustomerId = (await new Customer(thirdCustomer).save())._id;
});

describe('POST /transactions', () => {
  it('Should successfully create a new transaction', async () => {
    const newTransaction = {
      client: secondCustomer,
      items: [secondFurniture]
    };

    const response = await request(app).post('/transactions').send(newTransaction).expect(201);
    expect(response.body.client).to.include({
      name: secondCustomer.name,
    });
    expect(response.body.items[0]).to.include({
      name: secondFurniture.name,
    });
  });
});

describe('POST /transactions', () => {
  it('Should return a 400 error when data is missing or invalid', async () => {
    const invalidTransaction = {
      // Falta el campo "client"
      items: [secondFurniture]
    };

    // Intentar crear una transacción con datos inválidos
    const response = await request(app)
      .post('/transactions')
      .send(invalidTransaction)
      .expect(400);

    expect(response.body).to.include({});
  });
});

describe('DELETE /transactions/:id', () => {
  it('Should successfully delete a transaction by ID', async () => {
    const newTransaction = {
      client: secondCustomer,
      items: [secondFurniture]
    };
    const createResponse = await request(app)
      .post('/transactions')
      .send(newTransaction)
      .expect(201);

    const transactionId = createResponse.body._id;

    // Eliminar la transacción
    const deleteResponse = await request(app)
      .delete(`/transactions/${transactionId}`)
      .expect(200);

    // Verificar que la respuesta contenga los detalles de la transacción eliminada
    expect(deleteResponse.body).to.include({});
  });
});


describe('GET /transactions/:id', () => {
  it('Should successfully retrieve a transaction by ID', async () => {
    const newTransaction = {
      client: thirdCustomer,
      items: [secondFurniture]
    };

    const createResponse = await request(app)
      .post('/transactions')
      .send(newTransaction)
      .expect(201);

    const transactionId = createResponse.body._id;

    // Realizar la solicitud GET para obtener la transacción por su ID
    const getResponse = await request(app)
      .get(`/transactions/${transactionId}`)
      .expect(200);

    // Verificar que la respuesta contenga los detalles de la transacción correcta
    expect(getResponse.body._id).to.equal(transactionId);
    expect(getResponse.body.client).to.include(thirdCustomer)
    expect(getResponse.body.items[0]).to.include({
      name: secondFurniture.name,
    });
  });

  it('Should return a 404 error when the transaction ID does not exist', async () => {
    // Definir un ID que no existe en la base de datos
    const nonExistingTransactionId = '123456789012345678901234';

    //GET con un ID que no existe
    const getResponse = await request(app)
      .get(`/transactions/${nonExistingTransactionId}`)
      .expect(404);

    expect(getResponse.body).to.include({});
  });
});

describe('GET /transactions', () => {
  it('Should successfully retrieve all transactions', async () => {
    const getResponse = await request(app)
      .get('/transactions')
      .expect(404);
    expect(Array.isArray(getResponse.body)).to.be.false;
  });
});


describe('GET /transactions', () => {
  it('Should successfully retrieve all transactions', async () => {
    // Crear algunas transacciones para probar
    const transaction1 = {
      client: secondCustomer,
      items: [secondFurniture]
    };

    const transaction2 = {
      client: thirdCustomer,
      items: [secondFurniture]
    };

    // Crear las transacciones
    await request(app)
      .post('/transactions')
      .send(transaction1)
      .expect(201);

    await request(app)
      .post('/transactions')
      .send(transaction2)
      .expect(201);

    // Realizar la solicitud GET para obtener todas las transacciones
    const getResponse = await request(app)
      .get('/transactions')
      .expect(200);

    // Verificar que se hayan devuelto las transacciones correctamente
    expect(getResponse.body).to.be.an('array');
    expect(getResponse.body).to.have.lengthOf.at.least(2); // Al menos dos transacciones deberían estar presentes
    expect(getResponse.body[0]).to.include.all.keys('_id', 'client', 'items', 'timestamp', 'amount');
    expect(getResponse.body[1]).to.include.all.keys('_id', 'client', 'items', 'timestamp', 'amount');
  });
});


describe('PATCH /transactions/:id', () => {
  it('Should update timestamp of a transaction by ID', async () => {
    const newTransaction = {
      client: secondCustomer,
      items: [secondFurniture]
    };

    const createResponse = await request(app)
      .post('/transactions')
      .send(newTransaction)
      .expect(201);

    const transactionId = createResponse.body._id;

    // Actualización del timestamp
    const updates = {
      timestamp: new Date(),
    };

    // Solicitud PATCH para actualizar el timestamp de la transacción
    const patchResponse = await request(app)
      .patch(`/transactions/${transactionId}`)
      .send(updates)
      .expect(200);

    // Verifica que el timestamp se haya actualizado correctamente
    expect(patchResponse.body.timestamp).to.equal(updates.timestamp.toISOString());
  });

  it('Should update amount of a transaction by ID', async () => {
    const newTransaction = {
      client: secondCustomer,
      items: [secondFurniture]
    };

    const createResponse = await request(app)
      .post('/transactions')
      .send(newTransaction)
      .expect(201);

    const transactionId = createResponse.body._id;

    // Actualización del amount
    const updates = {
      amount: 500,
    };

    const patchResponse = await request(app)
      .patch(`/transactions/${transactionId}`)
      .send(updates)
      .expect(200);

    // Verifica que el amount se haya actualizado correctamente
    expect(patchResponse.body.amount).to.equal(updates.amount);
  });

  it('Should return a 404 error when the transaction ID does not exist', async () => {
    const nonExistingTransactionId = '123456789012345678901234';

    const updates = {
      timestamp: new Date(),
      amount: 500,
    };

    // Realizar la solicitud PATCH con un ID que no existe
    const patchResponse = await request(app)
      .patch(`/transactions/${nonExistingTransactionId}`)
      .send(updates)
      .expect(404);

    expect(patchResponse.body).to.include({});
  });
});

// Prueba para verificar que se maneja correctamente el caso de una transacción no encontrada en el PATCH
describe('PATCH /transactions/:id - Transaction Not Found', () => {
  it('Should return 404 Not Found if transaction not found', async () => {
    const nonExistingTransactionId = '123456789012345678901234';
    const updates = { amount: 1000 };

    const response = await request(app)
      .patch(`/transactions/${nonExistingTransactionId}`)
      .send(updates)
      .expect(404);

    expect(response.text).to.equal('Transaction not found');
  });
});


// Prueba para verificar que se maneja correctamente el caso de una solicitud GET de una transacción no existente
describe('GET /transactions/:id - Transaction Not Found', () => {
  it('Should return 404 Not Found if transaction ID does not exist', async () => {
    const nonExistingTransactionId = '123456789012345678901234';

    const response = await request(app)
      .get(`/transactions/${nonExistingTransactionId}`)
      .expect(404);

    expect(response.text).to.equal('Transaction not found');
  });
});

// Prueba para verificar que se maneja correctamente el caso de una solicitud GET de transacciones cuando no hay ninguna
describe('GET /transactions - No Transactions Found', () => {
  it('Should return an empty array if no transactions found', async () => {
    // Limpiar todas las transacciones existentes
    //await Transaction.deleteMany();

    const response = await request(app)
      .get('/transactions')
      .expect(404);
    expect(response.text).to.equal('No transactions found');
    expect(response.body).to.be.an('object');
  });
});
