const mongoose = require("mongoose");

const SHOW_ONLY_DB = 3;
const ADD_NEW_PERSON = 5;

if (process.argv.length < SHOW_ONLY_DB) {
  console.log(
    "Program expects at least one input argument:mongodb password, name(optional) and number(optional)"
  );
  process.exit(1);
}
const password = process.argv[2];
let name = "";
let number = "";
if (process.argv.length === ADD_NEW_PERSON) {
  name = process.argv[3];
  number = process.argv[4];
}

const url = `mongodb+srv://mikko:${password}@cluster0.0sewr.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected\n"))
  .catch((error) => console.log("Connection error!", error));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === SHOW_ONLY_DB) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === ADD_NEW_PERSON) {
  const generateId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const person = new Person({
    name: name,
    number: number,
    id: generateId(),
  });

  person.save().then(() => {
    console.log("person saved!");
    mongoose.connection.close();
  });
}
