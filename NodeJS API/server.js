const http = require("http");
const todos = [
  {id:1, text:'Task One'},
  {id:2, text:'Task Two'},
  {id:3, text:'Task Three'}
]
const server = http.createServer((req,res)=>{
  res.writeHead(404,{
    'Content-Type': 'text/html',
    'X-Powered-By': 'Node.js '
  });
  res.end(
    JSON.stringify({
      success: false,
      error: "Not Found",
      data: null
    })
  );
})
const PORT = 5000;
server.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
