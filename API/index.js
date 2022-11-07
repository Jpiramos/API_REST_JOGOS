require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.SECRET;


app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

function auth(req,res,next){
    const authToken = req.headers["authorization"];
    if(auth!=undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];
        jwt.verify(token,jwtSecret,(err,data)=>{
            if(err){
                res.status(401)
                res.json({err:"Token inválido"})
            }else{
                req.token = token;
                req.loggedUser = {id:data.id,email:data.email};
                req.empresa = "Saints Enterprise "
                next();
            }
        });
    }else{
        res.status(401);
        res.json({err:"Token inválido"})
    } 
};

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
    ],
    users:[
        {
            id:1,
            name:"João Pedro Ramos",
            email:"Jpiramos21@gmail.com",
            password:"12345"
        },

        {
            id:2,
            name:"Rafael Gomes",
            email:"Rafa12@gmail.com",
            password:"abcdefgh"
        }     
    ]
};


app.get("/games",auth,(req,res)=>{
    res.statusCode = 200;
    res.json({games: DB.games});
});

app.get("/game/:id",auth,(req,res)=>{

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

app.post("/game",auth,(req,res)=>{
    var {title,price,year} = req.body;
    DB.games.push({ 
        id:231,
        title,
        price,
        year
     });
     res.sendStatus(200);
});

app.delete("/game/:id",auth,(req,res)=>{

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

app.put("/game/:id",auth,(req,res)=>{

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

app.post("/auth",auth,(req,res)=>{

    var{email,password} = req.body

    if(email !=undefined){
        var user = DB.users.find(u =>email==email);

        if(user!=undefined){
            if(user.password==password){

                jwt.sign({id:user.id,email:user.email},jwtSecret,{expiresIn:"48h"},(err,token)=>{
                    if(err){
                        res.status(400);
                        res.json({err:"Falha interna !"})
                    }else{
                        res.status(200);
                        res.json({token:token})
                    }
                });
                
            }else{
                res.status(401);
                res.json({err:"Credenciais inválidas"})
            }

        }else{
            res.status(404);
            res.json({err:"Email enviado não cadastrado na base de dados"})
        }

    }else{
        res.status(400);
        res.json({err:"E-mail inválido"})
    }
});

app.listen(1919,()=>{
    console.log("API RODANDO")
});