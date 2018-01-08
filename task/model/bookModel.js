const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockValidate = (value) => {
    return value >= 0;
};

const bookSchema = new Schema({
    "name": {type: String, required: "Kérem adja meg a nevet"},
    "author": {type: String, required: "Kérem adja meg a szerzőt"},
    "description": {type: String, required: "Kérem adja meg a leírást"},
    "publisher": {type: String, required: "Kérem adja meg a kiadót"},
    "releaseDate": {type: Date},
    "pages": {type: Number, default: 0},
    "stock": {type: Number, validate: stockValidate}
});

module.exports = mongoose.model("book", bookSchema);