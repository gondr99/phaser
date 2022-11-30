import Phaser from "phaser";
import SocketManager from "../Core/SocketManager";
import { UserInfo } from "../Network/Protocol";

export default class LobbyScene extends Phaser.Scene
{
    popupDiv: HTMLDivElement;
    gameCanvas: HTMLCanvasElement;

    constructor()
    {
        super({key:"Lobby"});
        console.log("LobbyScene");
        SocketManager.Instance.addLobbyProtocol(this);
    }

    create(): void 
    {
        const sky = this.add.image(0, 0, "bg_sky").setOrigin(0, 0).setScale(4.5);
        

        this.gameCanvas = document.querySelector("#theGame > canvas") as HTMLCanvasElement;
        this.popupDiv = document.querySelector("#gameDiv") as HTMLDivElement;

        this.reDrawPopup(0);
        
        window.addEventListener("resize", ()=> this.reDrawPopup(400)); //화면 작아지면 같이 작아지기

        this.setUpLoginPopup();   
    }

    setUpLoginPopup(): void 
    {
        const nameInput = this.popupDiv.querySelector("#nameInput") as HTMLInputElement;
        const tooltip = this.popupDiv.querySelector("#tooltip") as HTMLDivElement;
        const loginBtn = this.popupDiv.querySelector("#btnLogin") as HTMLButtonElement;
        
        
        nameInput.addEventListener("keyup", () => {
            if(tooltip.classList.contains("on")) {
                tooltip.classList.remove("on");
            }
        });

        loginBtn.addEventListener("click", ()=>{
            console.log(nameInput.value.length);
            if( nameInput.value.length <= 0 || nameInput.value.length > 5) {

                let {x:popupX, y:popupY} = this.popupDiv.getBoundingClientRect();
                let {x:nameX, y:nameY} = nameInput.getBoundingClientRect();
                let offset = {x: nameX - popupX, y: nameY - popupY};

                let msgBox = tooltip.querySelector("span") as HTMLSpanElement;
                msgBox.innerHTML = "아이디는 공백일 수 없고, 최대 5글자 이내로 입력해야 합니다.";
                tooltip.style.left = `${offset.x}px`;
                tooltip.style.top = `${offset.y - 35}px`;
                tooltip.classList.add("on");
                return;    
            }

            let data: UserInfo = { name: nameInput.value}; //여기서는 플레이어아이디를 굳이 넣을 필요 없다.
            SocketManager.Instance.sendData("login_user", data);

        });

    }

    changeToLobby():void 
    {
        const container = this.popupDiv.querySelector("#pageContainer") as HTMLDivElement;
        container.style.left = "-100%";
    }


    reDrawPopup (time:number):void
    {
        setTimeout(()=>{
            let {width, height, marginLeft, marginTop} = this.gameCanvas.style;
            this.popupDiv.style.width = width;
            this.popupDiv.style.height = height;
            this.popupDiv.style.left = marginLeft;
            this.popupDiv.style.top = marginTop;

            let pages = this.popupDiv.querySelectorAll("#pageContainer > div") as NodeListOf<HTMLDivElement>;
            pages.forEach(p => {
                p.style.width = width;
                p.style.height = height;
            });
        }, time);
        
    }
}