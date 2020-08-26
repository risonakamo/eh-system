const express=require("express");

const app=express();

app.use("/viewer/*",express.static(`${__dirname}/../ehviewer`));
app.use("/build",express.static(`${__dirname}/../build`));

app.listen(80,()=>{
    console.log("express started");
});