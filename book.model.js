var mongoose = require('mongoose');  //importa a biblioteca do mongodb
var Schema = mongoose.Schema;     //cria uma variavel para o esquema do banco

//define a tabela
var BookSchema = new Schema({
    title: String,
    author: String,
    category: String
});

//exporta o esquema para ser utilizavel em outros arquivos
module.exports = mongoose.model('Book',BookSchema);