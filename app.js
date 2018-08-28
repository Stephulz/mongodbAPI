var express = require('express');   //importa o web server
var app = express();
var bodyParser = require('body-parser');  //importa a biblioteca necessaria para a leitura de itens no layout
var mongoose = require('mongoose');  //importa a biblioteca do mongodb
var Book = require('./book.model');  //importa o esquema
var port = 8080;  //define a porta

//define a String de conexao do banco
var db = 'mongodb://stephulz:password1@ds245337.mlab.com:45337/example'

//Conecta no banco utilizando a string
mongoose.connect(db);

app.use(bodyParser.json());        //define o bodyParser para json tornando possivel utliza-lo com elementos json
app.use(bodyParser.urlencoded({    //torna possivel receber ou enviar elementos body pela url
    extended: true
}));

//criando endpoint de hello world
app.get('/', function (req, res) {
    res.send('Hello World')
});

//criando endpoint de buscar todos
app.get('/books', function (req, res) {
   console.log("getting all books");
   Book.find({})
    .exec(function(err, books){    //devolve o resultado da query em json ou um erro
      if(err){
        res.send("error has occured");
      } else {
        console.log(books);
        res.json(books);           //transforma o resultado da query em json e manda como resposta
      }
    });       
});


//criando endpoint de buscar por _id(mongodb ObjectId)
app.get('/books/:id',function (req, res) {
   console.log("getting one book");
   Book.findOne({
       _id: req.params.id           //definindo busca pelo ObjectId(_id) do mongodb a partir do parametro da rota(id)
   })
   .exec(function (err, book) {     //devolve o resultado da query em json ou um erro
      if(err) {
          res.send("error has occured");
      }else{
          console.log(book);
          res.json(book);           //transforma o resultado da query em json e manda como resposta
      }
   });
});


//criando endpoint de post
app.post('/book', function (req, res) {
   var newBook = new Book();       //instancia a model para preparar os campos e inserir

   newBook.title = req.body.title;          //define os campos do json a serem recuperados (keys)
   newBook.author = req.body.author;        //define os campos do json a serem recuperados (keys)   
   newBook.category = req.body.category;    //define os campos do json a serem recuperados (keys)

   newBook.save(function (err, book) {      //tenta persistir os dados recebidos
       if(err){
           console.log('error saving book');
       } else {
           console.log(book);
           res.send(book);                  //retorna dados persistidos
       }
   });
});

//outra maneira de criar uma endpoint de post (mongodb)
app.post('/book2', function (req, res) {
    Book.create(req.body, function (err, book) {
        if(err){
            res.send('error saving book');
        } else {
            console.log(book);
            res.send(book);
        }
    })
    var newBook = new Book();       //instancia a model para preparar os campos e inserir
 
    newBook.title = req.body.title;          //define os campos do json a serem recuperados (keys)
    newBook.author = req.body.author;        //define os campos do json a serem recuperados (keys)   
    newBook.category = req.body.category;    //define os campos do json a serem recuperados (keys)
 
    newBook.save(function (err, book) {      //tenta persistir os dados recebidos
        if(err){
            console.log('error saving book');
        } else {
            console.log(book);
            res.send(book);                  //retorna dados persistidos
        }
    });
 });

 //criando endpoint de put
 app.put('/book/:id', function (req, res) {
    Book.findOneAndUpdate({
        _id: req.params.id              //definindo busca pelo ObjectId(_id) do mongodb a partir do parametro da rota(id)
    }, 
      {$set:
      {title: req.body.title}},         //campos a serem atualizados
      {upsert: true},                   //parametro opcional que funciona da seguinte forma: se o titulo não existir crie
        function (err, newBook) {
            if(err){
                console.log("error updating book");
            } else{
                console.log(newBook);   
                res.send(newBook);      //retorna dados atualizados
            }
     }); 
 });

 //criando endpoint de delete
 app.delete('/book/:id', function (req, res) {
    Book.deleteOne({
        _id: req.params.id                  //definindo busca pelo ObjectId(_id) do mongodb a partir do parametro da rota(id)
    },
        function (err, deletedBook){
            if(err){
                console.log("error deleting book");
            } else {
                console.log(deletedBook);
                res.send(deletedBook);      //retorna dados deletados
            }
        }
    ) 
 });

//sobe o server
app.listen(port, function(){   
    console.log('app listening on port '+port);
});