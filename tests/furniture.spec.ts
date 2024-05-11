import request from 'supertest';
import { expect } from "chai"
import { app } from '../src/app.js';
import { Furniture } from '../src/models/furniture.js';

let firstFurnitureId: string;
const firstFurniture = {
  name: "Sofá Chesterfield",
  description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
  category: "Sofás",
  dimensions: "200x30x10",
  materials: ["Cuero genuino", "Madera de nogal"],
  color: "Marron",
  style: "Clásico",
  price: 999.99,
  imageUrl: "https://example.com/sofa.jpg",
  quantity: 1
}


beforeEach(async () => {
  await Furniture.deleteMany();
  firstFurnitureId = (await new Furniture(firstFurniture).save())._id;
})

describe('POST /furnitures', () => {
  it('Should successfully create a new furniture', async () => {
    const newFurniture = {
      name: "Sofá",
      description: "Sofá moderno.",
      category: "Sofás",
      dimensions: "200x30x10",
      materials: ["Cuero genuino", "Madera de nogal"],
      color: "Blanco",
      style: "Moderno",
      price: 345.33,
      imageUrl: "https://example.com/sofa2.jpg",
      quantity: 1
    }
    const response = await request(app).post('/furnitures').send(newFurniture).expect(201);
    expect(response.body).to.include({
      name: "Sofá",
      description: "Sofá moderno.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Blanco",
      style: "Moderno",
      price: 345.33,
    });
  });
});

describe('GET /furnitures', () => {
  it('Should successfully get a furniture by name', async () => {
    const response = await request(app).get('/furnitures?name=Sofá Chesterfield').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('GET /furnitures', () => {
  it('Should successfully get a furniture by color', async () => {
    const response = await request(app).get('/furnitures?color=Marron').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('GET /furnitures', () => {
  it('Should successfully get a furniture by description', async () => {
    const response = await request(app).get('/furnitures?description=clásico').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('GET /furnitures', () => {
  it('Should successfully get a furniture by name, color, and description', async () => {
    const response = await request(app).get('/furnitures?name=Sofá Chesterfield&color=Marron&description=clásico').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('GET /furnitures', () => {
  it('Should fail get a furniture by name', async () => {
    const response = await request(app).get('/furnitures?name=mesa').expect(404);
  });
});

describe('GET /furnitures', () => {
  it('Should fail get a furniture by color', async () => {
    const response = await request(app).get('/furnitures?color=azul').expect(404);
  });
});

describe('GET /furnitures', () => {
  it('Should fail get a furniture by description', async () => {
    const response = await request(app).get('/furnitures?description=raro').expect(404);
  });
});

describe('GET /furnitures/:id', () => {
  it('Should successfully get a furniture by ID', async () => {
    const response = await request(app).get(`/furnitures/${firstFurnitureId}`).expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('GET /furnitures/:id', () => {
  it('Should fail getting a furniture by ID', async () => {
    await request(app).get("/furnitures/663ba5184f2c9c380b980826").expect(404);
  });
});

describe('PATCH /furnitures', () => {
  it('Should successfully update a furniture by name', async () => {
    const newfurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1
    }
    const response = await request(app).patch('/furnitures?name=Sofá Chesterfield').send(newfurniture).expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield"
    });
  });
});

describe('PATCH /furnitures', () => {
  it('Should successfully update a furniture by color', async () => {
    const newfurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1

    }
    const response = await request(app).patch('/furnitures?color=Marron').send(newfurniture).expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield"
    });
  });
});

describe('PATCH /furnitures', () => {
  it('Should successfully update a furniture by description', async () => {
    const newfurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1

    }
    const response = await request(app).patch('/furnitures?description=clásico').send(newfurniture).expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield"
    });
  });
});

describe('PATCH /furnitures', () => {
  it('Should successfully update a furniture by name, color and description', async () => {
    const newfurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1
    }
    const response = await request(app).patch('/furnitures?name=Sofá Chesterfield&color=Marron&description=clásico').send(newfurniture).expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield"
    });
  });
});

describe('PATCH /furnitures', () => {
  it('Should fail updating a furniture by name', async () => {
    const newFurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1

    }
    await request(app).patch('/furnitures?name=mesa').send({
      newFurniture
    }).expect(400);
  });
});

describe('PATCH /furnitures', () => {
  it('Should fail updating a furniture by color', async () => {
    const newFurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1

    }
    await request(app).patch('/furnitures?color=azul').send({
      newFurniture
    }).expect(400);
  });
});

describe('PATCH /furnitures', () => {
  it('Should fail updating a furniture by description', async () => {
    const newFurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1

    }
    await request(app).patch('/furnitures?description=raro').send({
      newFurniture
    }).expect(400);
  });
});


describe('PATCH /furnitures/:id', () => {
  it('Should successfully update a furniture by ID', async () => {
    const newfurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1
    }
    const response = await request(app).patch(`/furnitures/${firstFurnitureId}`).send(newfurniture).expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield"
    });
  });
});

describe('PATCH /furnitures/:id', () => {
  it('Should fail updating a furniture by ID', async () => {
    const newFurniture = {
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
      color: "Marron",
      style: "Clásico",
      price: 10.99,
      imageUrl: "https://example.com/sofa.jpg",
      quantity: 1

    }
    await request(app).patch(`/furnitures/663ba5184f2c9c380b980826`).send({
      newFurniture
    }).expect(400);
  });
});

describe('DELETE /furnitures', () => {
  it('Should successfully delete a furniture by name', async () => {
    const response = await request(app).delete('/furnitures?name=Sofá Chesterfield').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('DELETE /furnitures', () => {
  it('Should successfully delete a furniture by color', async () => {
    const response = await request(app).delete('/furnitures?color=Marron').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('DELETE /furnitures', () => {
  it('Should successfully delete a furniture by description', async () => {
    const response = await request(app).delete('/furnitures?description=clásico').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('DELETE /furnitures', () => {
  it('Should successfully delete a furniture by name, color and description', async () => {
    const response = await request(app).delete('/furnitures?name=Sofá Chesterfield&color=Marron&description=clásico').expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('DELETE /furnitures', () => {
  it('Should fail deleting a furniture by name', async () => {
    await request(app).delete('/furnitures?name=silla').expect(404);
  });
});

describe('DELETE /furnitures', () => {
  it('Should fail deleting a furniture by color', async () => {
    await request(app).delete('/furnitures?color=rojo').expect(404);
  });
});


describe('DELETE /furnitures', () => {
  it('Should fail deleting a furniture by description', async () => {
    await request(app).delete('/furnitures?description=raro').expect(404);
  });
});

describe('DELETE /furnitures/:id', () => {
  it('Should successfully delete a furniture by ID', async () => {
    const response = await request(app).delete(`/furnitures/${firstFurnitureId}`).expect(200);
    expect(response.body).to.include({
      name: "Sofá Chesterfield",
      description: "Sofá clásico de estilo Chesterfield con tapizado de cuero genuino.",
      category: "Sofás",
      dimensions: "200x30x10",
    });
  });
});

describe('DELETE /furnitures/:id', () => {
  it('Should fail deleting a furniture by ID', async () => {
    await request(app).delete("/furnitures/663ba5184f2c9c380b980826").expect(404);
  });
});


describe('GET /furnitures/:id', () => {
  it('Should return 404 when fetching a non-existing furniture by ID', async () => {
    const nonExistingId = '663ba5184f2c9c380b980826';
    const response = await request(app)
      .get(`/furnitures/${nonExistingId}`)
      .expect(404);
    expect(response.text).to.equal('Furniture not found');
  });
});

describe('PATCH /furnitures/:id', () => {
  it('Should return 404 when updating a non-existing furniture by ID', async () => {
    const nonExistingId = '663ba5184f2c9c380b980826';
    const response = await request(app)
      .patch(`/furnitures/${nonExistingId}`)
      .send({ name: "Updated Sofa" })
      .expect(404);
    expect(response.text).to.equal('Furniture not found');
  });
});

describe('DELETE /furnitures/:id', () => {
  it('Should return 404 when deleting a non-existing furniture by ID', async () => {
    const nonExistingId = '663ba5184f2c9c380b980826';
    const response = await request(app)
      .delete(`/furnitures/${nonExistingId}`)
      .expect(404);
    expect(response.text).to.equal('furniture not found');
  });
});

describe('Furniture Model Validation', () => {
  describe('Invalid Dimensions Format', () => {
    it('Should throw an error if dimensions format is not valid', async () => {
      const furniture = new Furniture({
        name: "Test Furniture",
        description: "Test description",
        dimensions: "200x30",
        color: "Blue",
        price: 100,
        quantity: 1
      });

      let error;
      try {
        await furniture.save();
      } catch (e) {
        error = e;
      }

      expect(error).to.exist;
      expect(error.message).to.equal('Furniture validation failed: dimensions: Dimensions format not valid');
    });
  });
});