import Http from 'http'
import Express, {Application, NextFunction, Request, Response} from 'express';
import Path from 'path'

const app: Application = Express();

app.use(Express.static('public'));

app.get("/", (req : Request, res : Response )=>{
    console.log(__dirname);
    //res.sendFile(Path.join(__dirname))
});

const server = Http.createServer(app);

server.listen(50000, ()=>{
    console.log("서버가 50000번 포트에서 실행중입니다.");
});