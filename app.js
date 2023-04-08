const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin-jafer:test123@cluster0.xa98cq6.mongodb.net/todoList");
var today=new Date();
var option={
  weekday: "long",
  day: "numeric",
  month: "long"
}
var day=today.toLocaleDateString("en-US",option);
const itemSchema={
  name:{
    type: String,
    required: [true,"hello"]
  }
};
const listSchema={
  name: String,
  items: [itemSchema]
}
const List=mongoose.model("list",listSchema);
const itemm=mongoose.model("item",itemSchema);
const item1=new itemm({
  name: "welcome to do list"
});
const item2=new itemm({
  name: "press + button to add item"
});
app.set("view engine","ejs");
var item=[item1,item2];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res){
   
    itemm.find({},function(err0,fitem){
      if(err0)
      console.log(err0);
      else{
        if(fitem.length==0)
        {
          itemm.insertMany(item,function(err1){
            if(err1)
            console.log(err1);
            else
            console.log("sucessfully");
          });
          res.redirect("/");
        }
        else
        res.render("list",{kindofday: day,newitem: fitem});
      }
    })
    
    //res.send("welcome");
})
app.post("/delete",function(req,res){
  const id=req.body.check;
  const listname=req.body.listname;
  if(listname===day){
  itemm.deleteOne({_id: id},function(){
console.log("deleted succesfully");
  });
  res.redirect("/");
}
else{
  List.findOneAndUpdate({name: listname},{$pull: {items: {_id: id}}},function(err,re){
    res.redirect("/"+listname);
  })
}
});
app.get("/:topic",function(req,res){
  const topic=req.params.topic;
  List.findOne({name: topic},function(err,flist){
    if(!flist)
    {
      const list1=new List({
        name: topic,
        items: item
      });
      list1.save();
      res.redirect("/"+topic);
    }
    else{
      res.render("list",{kindofday: flist.name,newitem: flist.items});
    }
  });
});
app.post("/",function(req,res){
  const name=req.body.add;
  const listname=req.body.list;
  const i=new itemm({
    name: name
  });
  if(listname===day){
  i.save();
  res.redirect("/");
  }
  else{
    List.findOne({name: listname},function(err,flist){
      flist.items.push(i);
      flist.save();
      res.redirect("/"+listname);
    })
  }
  })
app.listen(process.env.PORT ||3200,function(){
console.log("server started at 3000");
})
//firoz@skimbox.us