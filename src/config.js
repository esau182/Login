const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/Login-tut";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database Connected Successfully"))
.catch((err) => console.error("Database cannot be Connected:", err));

// Define el esquema y modelo como antes
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model("users", Loginschema);

module.exports = collection;
