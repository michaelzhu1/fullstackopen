const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("dist"));

const logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    JSON.stringify(req.body),
  ].join(" ");
});

app.use(logger);

// const requestLogger = (request, response, next) => {
//   console.log("Method", request.method);
//   console.log("Path: ", request.path);
//   console.log("Body: ", request.body);
//   console.log("---");
//   next();
// };
// app.use(requestLogger);

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const now = new Date();
  const content = `<p>Phonebook has info for ${persons.length} people </p>
        <p>${now} </p>
      `;
  response.send(content);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).json({ error: "person not found" });
  } else {
    response.json(person);
  }
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  const id = Math.floor(Math.random() * 100000);
  const nameExists = persons.some((person) => person.name === name);
  if (!name || !number) {
    return response.status(400).json({ error: "name or number not entered" });
  } else if (nameExists) {
    return response.status(409).json({ error: "name must be unique" });
  }
  const person = {
    id: String(id),
    name: name,
    number: number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running at port ${PORT}`);
