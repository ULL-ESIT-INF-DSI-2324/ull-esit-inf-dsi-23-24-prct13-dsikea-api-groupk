
### Práctica 13 - DSIkea: API REST con Node/Express

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupk/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupk/actions/workflows/node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupk/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupk?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupk&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupk)


## Datos identificativos - Grupo K

- Guillermo Díaz Bricio - alu0101505688
- Jóse Miguel Díaz González - alu0101203294
- Diego Díaz Fernández - alu0101130026

## Objetivos

En esta práctica, la segunda grupal y última de la asignatura, se nos pide implementar un API REST usando Node/Express que lleve a cabo operaciones CRUD sobre clientes, muebles, proveedores y transacciones. También debemos hacer uso de MongoDB como sistema de base de datos y Moongose para gestionarla.

Para ello hemos estructurado el código en distintas carpetas que iremos comentando poco a poco. La primera que vemos va a ser la carpeta models.

## Models

En esta carpeta se encuentran los modelos de los 4 objetos con los que tenemos que trabajar. Comentaremos el cliente, porque el resto son prácticamente iguales. Lo primero será definir una interfaz, que extiende a Document de moongose. En ella definiremos los datos de un cliente como nombre, teléfono...  

```
export interface CustomerDocumentInterface extends Document {
  name: string;
  surname: string;
  telephoneNumber: string;
  email?: string;
  address: string;
  postalCode: number;
  city: string;
  gender?: string;
  nif: string;
}
```

Lo siguiente será definir su schema, explicando qué debe haber en cada campo de los datos que definimos en la interfaz anterior.

```
const CustomerSchema = new Schema<CustomerDocumentInterface>({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  surname: {
    type: String,
    required: true,
    lowercase: true
  },
  telephoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      // Permite diferentes formatos de número de teléfono
      if (!value.match(/^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/)) {
        throw new Error("Telephone number format is not valid");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error("Email format is not valid");
      }
    },
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    lowercase: true
  },
  postalCode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true
  },
  gender: {
    type: String,
    validate: (value: string) => {
      return ["male", "female", "other"].includes(value.toLowerCase()); 
    },
    lowercase: true
  },
  nif: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[0-9]{8}[a-zA-Z]/)) {
        throw new Error("Invalid Nif");
      }
      else if (!validator.isAlphanumeric(value)) {
        throw new Error("Only Alphanumeric characters are allowed");
      }
    }
  },
});
```

Por último, lo que debemos hacer es instanciar el cliente utilizando model, ayudándonos de su interfaz y schema.

```
export const Customer = model<CustomerDocumentInterface>(
  "Customer",
  CustomerSchema,
);
```

Los otros 3 objetos que son mueble, proveedor y transacción siguen la misma estructura como ya comentamos y se han descrito en ficheros diferentes. Pasamos ahora a explicar la siguiente carpeta.

## Routers

Para esta carpeta, seguiremos la idea de la carpeta anterior, explicaremos el fichero de los clientes porque los demás siguen ese esquema. Primero definiremos como se publica un cliente en la db.

```

ustomerRouter.post("/customers", (req, res) => {
  const customer = new Customer(req.body);
  customer
    .save()
    .then((customer) => {
      res.status(200).send(customer);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
```

Después lo que haremos será definir dos getters, uno buscándolo por su nif y el otro buscándolo por su id.

```

customerRouter.get("/customers", (req, res) => {
  const nif = req.query.nif;
  if (nif) {
    Customer.find({nif: nif}).then((customers) => {
      if (customers.length !== 0) {
        res.status(200).send(customers);
      } else {
        res.status(404).send("Customer not found");
      } 
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Nif not provided");
  }
});


customerRouter.get("/customers/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (!customer) res.status(404).send("Customer not found");
      else res.status(200).send(customer);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
```

Lo siguiente serán los patch del cliente, igual que antes, uno por su nif y el otro por su id.

```
customerRouter.patch("/customers", (req, res) => {
  const nif = req.query.nif;
  if (nif) {
    const allowedUpdates = [
      "name",
      "surname",
      "telephoneNumber",
      "email",
      "address",
      "postalCode",
      "city",
      "gender",
    ];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send("Update not permitted");
    } else {
      Customer.findOneAndUpdate({ nif: nif }, req.body, {
        new: true,
        runValidators: true,
      })
        .then((customer) => {
          if (!customer) res.status(404).send("Customer not found");
          else res.status(200).send(customer);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }
  } else res.status(400).send("Nif not provided");
});

/**
 * Patch del cliente con su id
 */
customerRouter.patch("/customers/:id", (req, res) => {
  const allowedUpdates = [
    "name",
    "surname",
    "telephoneNumber",
    "email",
    "address",
    "postalCode",
    "city",
    "gender",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidUpdate) {
    res.status(400).send("Update not permitted");
  } else {
    Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((customer) => {
        if (!customer) res.status(404).send("Customer not found");
        else res.status(200).send(customer);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }
});
```

Por último definimos los métodos para borrar clientes de la db, una vez más primero con su nif y después con el id.

```
customerRouter.delete("/customers", (req, res) => {
  const nif = req.query.nif;
  if (nif) {
    Customer.findOneAndDelete({ nif: nif })
      .then((customer) => {
        if (!customer) res.status(404).send("Customer not found");
        else res.status(200).send(customer);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(400).send("Nif not provided");
  }
});


customerRouter.delete("/customers/:id", (req, res) => {
  Customer.findByIdAndDelete(req.params.id)
    .then((customer) => {
      if (!customer) res.status(404).send("Customer not found");
      else res.status(200).send(customer);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
```

Por último, tenemos que destacar que también hemos creado un router por defecto, este sí difiere del esquema que acabamos de explicar con el cliente. En este solo incluiremos el código siguiente:

```
export const defaultRouter = express.Router();

defaultRouter.all("*", (_, res) => {
  res.status(501).send();
})
```

Terminada esta carpeta, en la que se incluye la implementación también de los otros 3 routers, comentaremos la siguiente.


## Conclusiones

## Bibliografía

- https://expressjs.com/es/
- https://www.mongodb.com/
- https://mongoosejs.com/
