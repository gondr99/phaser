import Http from 'http'
import Express, {Application, Request, Response} from 'express'
import Path from 'path'
import {Server, Socket} from 'socket.io';
import SessionManager from './SessionManager';
import Session from './Session';
import MapManager from './ServerMapManager';
import { addServerSocketListener } from '../Network/ServerListener';
import JobTimer from './JobTimer';
import ServerMapManager from './ServerMapManager';

//익스프레스 웹 엔진을 만들어주고
const app: Application = Express();

app.use(Express.static("public"));

//맵정보 리딩파트
const mapPath: string = Path.join(__dirname, "..", "assets", "level1_stage.json" );
MapManager.Instance = new MapManager(mapPath); //클라이언트 매니저랑 달라
//end of 맵 정보 리딩 파트

//엔진을 기반으로 서버를 만들어준다.
const server = Http.createServer(app);
//익스프레스로 만들어진 웹서버에다가 소켓서버를 붙여서 만들어주는거
const io =  new Server(server);

// 세션맵을 만들어서 연결하는 사람들을 세션으로 만들어서 맵에 넣는다.
// 연결을 종료하면 맵에서 빼준다.
// 이동을 동기화한다. 
SessionManager.Instance = new SessionManager(); 
 
//io는 서버의 소켓이다.
io.on("connection", (socket: Socket) => {
    //여기의 socket은 클라이언트와 연결되는 서버의 소켓이다.
    console.log(`${socket.id}님이 접속했습니다.`);

    //세션 만들어서 넣어주고
    let session:Session = new Session(socket);
    SessionManager.Instance.addSession(socket.id, session);

    //세션에 리스너들을 넣어준다.
    //여기서 리스너들을 종류별로 분할해줄 수는 있음.
    addServerSocketListener(socket, session); 
     
});

server.listen(50000, ()=>{
    console.log(`Server is running on 50000 port`);
});

//이 타이머는 이제 룸으로 이동해야 해.
let sendPositionTimer:JobTimer = new JobTimer(50, ()=>{
    let pList = SessionManager.Instance.getPlayerList();
    //각 플레이어 정보 싱크
    SessionManager.Instance.broadcast("info_sync", {list:pList}, "none", false); //모두에게 브로드캐스팅
});
sendPositionTimer.startTimer();

//모니터링 웹서버 부분
app.get("/info", (req:Request, res:Response)=>{
    let list = SessionManager.Instance.getPlayerList();
    let spawn = ServerMapManager.Instance.spawnPoints;
    res.json({list, spawn});
});  

app.get("/error", (req:Request, res:Response)=>{
    res.send(`<h1>ErrorPage</h1>`);
});