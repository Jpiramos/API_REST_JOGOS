const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Banco de dados fake
var DB ={
    games:[
        {
            id:23,
            title:"Assassins Creed Syndicate",
            year: 2016,
            price: 60

        },
        {
            id:100,
            title:"Fifa 22",
            year: 2021,
            price: 75

        },
        {
            id:65,
            title:"Dota 2",
            year: 2009,
            price: 10

        },
        {
            id:10,
            title:"Minecraft",
            year: 2008,
            price: 40

        },
    ]
};


app.get("/games",(req,res)=>{
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/game/:id",(req,res)=>{

    if(isNaN(req.params.id)){
        res.sendStatus(400);

    }else{
       var id = parseInt(req.params.id);

       var game = DB.games.find(g => g.id == id)
       
       if(game != undefined){
        res.statusCode=200
        res.json(game)
       }else{

        res.sendStatus(404)
       }
    }

});

app.post("/game",(req,res)=>{
    var {title,price,year} = req.body;
    DB.games.push({ 
        id:231,
        title,
        price,
        year
     });
     res.sendStatus(200);
});

app.delete("/game/:id",(req,res)=>{

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
       var id = parseInt(req.params.id);
       var index= DB.games.findIndex (g =>g.id ==id);

       if (index == -1){
        res.statusCode(404);
       }else{
        DB.games.splice(index,1)
        res.sendStatus(200)
       }
    }
});

app.put("/game/:id",(req,res)=>{

    if(isNaN(req.params.id)){
        res.sendStatus(400);

    }else{
       var id = parseInt(req.params.id);

       var game = DB.games.find(g => g.id == id)
       
       if(game != undefined){

        var {title,price,year} = req.body;

        if(title !=undefined){
            game.title = title
        };

        if(price !=undefined){
            if(isNaN(price)){
                res.sendStatus(400)
            }else{ 
                game.price = price
            }
        };

        if(year !=undefined){
            if(isNaN(year)){
                res.sendStatus(400)
            }else{ 
                game.year = year
            }   
        };

        res.sendStatus(200);
       }else{
        res.sendStatus(404)
       }
    }
});


app.listen(8080,()=>{
    console.log("API RODANDO")
})