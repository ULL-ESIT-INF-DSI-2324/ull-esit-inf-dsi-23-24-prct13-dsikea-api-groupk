import request from 'supertest';
import { expect } from "chai"
import { app } from '../src/app.js';
import { Provider } from '../src/models/provider.js';

let firstProviderId: string;
const firstProvider = {
  name: "Furniture World",
  address: "123 Main Street",
  telephoneNumber: "+34645678901",
  email: "info@furnitureworld.com",
  website: "https://www.furnitureworld.com",
  cif: "A12345678"
}

beforeEach(async () => {
  await Provider.deleteMany();
  firstProviderId = (await new Provider(firstProvider).save())._id;
})

describe('POST /providers', () => {
  it('Should successfully create a new provider', async () => {
    const newprovider = {
      name: "Furniture Sales",
      address: "123 Secondary Street",
      telephoneNumber: "+34643678901",
      email: "info@furnituresales.com",
      website: "https://www.furnituresales.com",
      cif: "A12335678"
    }
    const response = await request(app).post('/providers').send(newprovider).expect(201);
    expect(response.body).to.include(newprovider);
  });
});

describe('POST /providers', () => {
  it('Should fail creating a new provider', async () => {
    await request(app).post('/providers').send(firstProvider).expect(400);
  });
});

describe('GET /providers', () => {
  it('Should successfully get a provider by CIF', async () => {
    const response = await request(app).get('/providers?cif=A12345678').expect(200);
    expect(response.body).to.include(firstProvider);
  });
});

describe('GET /providers', () => {
  it('Should fail getting a provider by CIF', async () => {
    await request(app).get('/providers?cif=Z66666666').expect(404);
  });
});

describe('GET /providers/:id', () => {
  it('Should successfully get a provider by ID', async () => {
    const response = await request(app).get(`/providers/${firstProviderId}`).expect(200);
    expect(response.body).to.include(firstProvider);
  });
});

describe('GET /providers/:id', () => {
  it('Should fail getting a provider by ID', async () => {
    await request(app).get("/providers/663ba5184f2c9c380b980826").expect(404);
  });
});

describe('PATCH /providers', () => {
  it('Should successfully update a provider by CIF', async () => {
    const newprovider = {
      name: "Furniture Sales",
      address: "123 Secondary Street",
      telephoneNumber: "+34643678901",
      email: "info@furnituresales.com",
      website: "https://www.furnituresales.com",
    }
    const response = await request(app).patch('/providers?cif=A12345678').send(newprovider).expect(200);
    expect(response.body).to.include(newprovider);
  });
});

describe('PATCH /providers', () => {
  it('Should fail updating a provider by CIF', async () => {
    const newprovider = {
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
    await request(app).patch('/providers?cif=A12335678').send(newprovider).expect(400);
  });
});


describe('PATCH /providers/:id', () => {
  it('Should successfully update a provider by ID', async () => {
    const newprovider = {
      name: "Furniture Sales",
      address: "123 Secondary Street",
      telephoneNumber: "+34643678901",
      email: "info@furnituresales.com",
      website: "https://www.furnituresales.com"
    }
    const response = await request(app).patch(`/providers/${firstProviderId}`).send(newprovider).expect(200);
    expect(response.body).to.include(newprovider);
  });
});

describe('PATCH /providers/:id', () => {
  it('Should fail updating a provider by ID', async () => {
    const newprovider = {
      name: "Furniture Sales",
      address: "123 Secondary Street",
      telephoneNumber: "+34643678901",
      email: "info@furnituresales.com",
      website: "https://www.furnituresales.com",
      cif: "B38492011"
    }
    await request(app).patch(`/providers/${firstProviderId}`).send(newprovider).expect(400);
  });
});

describe('DELETE /providers', () => {
  it('Should successfully delete a provider by CIF', async () => {
    const response = await request(app).delete('/providers?cif=A12345678').expect(200);
    expect(response.body).to.include(firstProvider);
  });
});

describe('DELETE /providers', () => {
  it('Should fail deleting a provider by CIF', async () => {
    await request(app).delete('/providers?cif=B21345678').expect(404);
  });
});

describe('DELETE /providers/:id', () => {
  it('Should successfully delete a provider by ID', async () => {
    const response = await request(app).delete(`/providers/${firstProviderId}`).expect(200);
    expect(response.body).to.include(firstProvider);
  });
});

describe('DELETE /providers/:id', () => {
  it('Should fail deleting a provider by ID', async () => {
    await request(app).delete("/providers/663ba5184f2c9c380b980826").expect(404);
  });
});
