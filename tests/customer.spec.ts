import request from 'supertest';
import { expect } from "chai"
import { app } from '../src/app.js';
import { Customer } from '../src/models/customer.js';

let firstCustomerId: string;
const firstCustomer = {
  name: "Juan",
  surname: "Pérez",
  telephoneNumber: "+34663890275",
  email: "juanillo@example.com",
  address: "Calle Principal",
  postalCode: 12345,
  city: "Ciudad Ejemplo",
  gender: "Male",
  nif: "12345678C"
}

beforeEach(async () => {
  await Customer.deleteMany();
  firstCustomerId = (await new Customer(firstCustomer).save())._id;
})

describe('POST /customers', () => {
  it('Should successfully create a new customer', async () => {
    const newCustomer = {
      name: "Pedro",
      surname: "Lopez",
      telephoneNumber: "+34663832265",
      email: "pedrillo@example.com",
      address: "Calle Secundaria",
      postalCode: 12545,
      city: "Ciudad Ejemplo Ejemplo",
      gender: "Male",
      nif: "12333678B"
    }
    const response = await request(app).post('/customers').send(newCustomer).expect(201);
    expect(response.body).to.include(newCustomer);
  });
});

describe('POST /customers', () => {
  it('Should fail creating a new customer', async () => {
    await request(app).post('/customers').send(firstCustomer).expect(400);
  });
});

describe('GET /customers', () => {
  it('Should successfully get a customer by NIF', async () => {
    const response = await request(app).get('/customers?nif=12345678C').expect(200);
    expect(response.body).to.include(firstCustomer);
  });
});

describe('GET /customers', () => {
  it('Should fail getting a customer by NIF', async () => {
    await request(app).get('/customers?nif=66666666Z').expect(404);
  });
});

describe('GET /customers/:id', () => {
  it('Should successfully get a customer by ID', async () => {
    const response = await request(app).get(`/customers/${firstCustomerId}`).expect(200);
    expect(response.body).to.include(firstCustomer);
  });
});

describe('GET /customers/:id', () => {
  it('Should fail getting a customer by ID', async () => {
    await request(app).get("/customers/663ba5184f2c9c380b980826").expect(404);
  });
});

describe('PATCH /customers', () => {
  it('Should successfully update a customer by NIF', async () => {
    const newCustomer = {
      name: "Laura",
      surname: "Pérez",
      telephoneNumber: "+34663890275",
      email: "juanillo@example.com",
      address: "Calle Principal",
      postalCode: 12345,
      city: "Ciudad Ejemplo",
      gender: "Female",
    }
    const response = await request(app).patch('/customers?nif=12345678C').send(newCustomer).expect(200);
    expect(response.body).to.include(newCustomer);
  });
});

describe('PATCH /customers', () => {
  it('Should fail updating a customer by NIF', async () => {
    const newCustomer = {
      name: "Laura",
      surname: "Pérez",
      telephoneNumber: "+34663890275",
      email: "juanillo@example.com",
      address: "Calle Principal",
      postalCode: 12345,
      city: "Ciudad Ejemplo",
      gender: "Female",
      nif: "4598434B"
    }
    await request(app).patch('/customers?nif=12345678C').send(newCustomer).expect(400);
  });
});


describe('PATCH /customers/:id', () => {
  it('Should successfully update a customer by ID', async () => {
    const newCustomer = {
      name: "Roberta",
      surname: "Pérez",
      telephoneNumber: "+34663890275",
      email: "juanillo@example.com",
      address: "Calle Principal",
      postalCode: 12345,
      city: "Ciudad Ejemplo",
      gender: "Female",
    }
    const response = await request(app).patch(`/customers/${firstCustomerId}`).send(newCustomer).expect(200);
    expect(response.body).to.include(newCustomer);
  });
});

describe('PATCH /customers/:id', () => {
  it('Should fail updating a customer by ID', async () => {
    const newCustomer = {
      name: "Roberta",
      surname: "Pérez",
      telephoneNumber: "+34663890275",
      email: "juanillo@example.com",
      address: "Calle Principal",
      postalCode: 12345,
      city: "Ciudad Ejemplo",
      gender: "Female",
      nif: "54672345B"
    }
    await request(app).patch(`/customers/${firstCustomerId}`).send(newCustomer).expect(400);
  });
});






describe('DELETE /customers', () => {
  it('Should successfully delete a customer by NIF', async () => {
    const response = await request(app).delete('/customers?nif=12345678C').expect(200);
    expect(response.body).to.include(firstCustomer);
  });
});

describe('DELETE /customers', () => {
  it('Should fail deleting a customer by NIF', async () => {
    await request(app).delete('/customers?nif=21345678C').expect(404);
  });
});

describe('DELETE /customers/:id', () => {
  it('Should successfully delete a customer by ID', async () => {
    const response = await request(app).delete(`/customers/${firstCustomerId}`).expect(200);
    expect(response.body).to.include(firstCustomer);
  });
});

describe('DELETE /customers/:id', () => {
  it('Should fail deleting a customer by ID', async () => {
    await request(app).delete("/customers/663ba5184f2c9c380b980826").expect(404);
  });
});




