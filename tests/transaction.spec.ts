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
