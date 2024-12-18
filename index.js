// const os = require('os');
// console.log(os.homedir())

const { log } = require('console');
const fs = require('fs');

// // read file

//     //Sync
//     const file = fs.readFileSync('./test.txt','utf-8');

//     //Async
//     const fileContent = fs.readFile('./test.txt','utf-8',(err, data)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log(data);
//         }
//     })

// // write file

//         //Sync
//         fs.writeFileSync('./test.json','Hello World');

//         //Async
//         fs.writeFile('./test.json',JSON.stringify([{id:1, name: "amr"}]),(err)=>{
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 console.log('done');
//             }
//         })

//delete file

//Sync
// fs.unlinkSync('./test.json');

//Async
// fs.unlink('./test.json',(err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log('done');
//     }
// })

// const rstream = fs.createReadStream('./test.txt');
// const wstream = fs.createWriteStream('./test2.txt');

// rstream.on('data',(chunk)=>{
//     console.log(chunk);
//     wstream.write(chunk);
// }

// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.end("hello world");
// })

// server.listen(3001,() => {
//     console.log("listening on port 3001");
// })


const express = require("express");

const app = express();


app.get('/', (req, res) => {
    res.send("hello world");
})

app.listen('3001', () => {
    console.log("listening on port 3001");
})