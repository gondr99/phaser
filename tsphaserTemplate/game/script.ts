const s:string = `Hello world this is html`;
console.log(s);


let dom = document.querySelector<HTMLDivElement>("#main");
dom!.innerHTML = s;