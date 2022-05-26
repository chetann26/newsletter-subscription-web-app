const express=require('express');
//const  request=require('request');
const bodyParser=require('body-parser');
const { stringify } = require('querystring');
const https=require('https');
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
    var firstname=req.body.fname;
    var lastname=req.body.lname;
    var email=req.body.email;
    
    const data={
        members:[
            {
                email_address: email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            } 
        ]
    };
    const jsonData=JSON.stringify(data);
    const url="https://us17.api.mailchimp.com/3.0/lists/{your list id} "
    const options= {
        method:"POST",
        auth: "cadet26:{your api key}"
    }
    const request=https.request(url,options,function(response){
          response.on("data",function(data){
              console.log(JSON.parse(data));
          })
          var filename;
          if(response.statusCode===200){
              filename="/success.html";
          }else{
              filename="/fail.html";
          }
          res.sendFile(__dirname+filename);
     }); 
    request.write(jsonData);
    request.end(); 
    
});
app.listen(process.env.PORT || 3000,function(){
    console.log("server listening at port 3000");
});

