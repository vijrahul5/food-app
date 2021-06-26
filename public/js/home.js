const spanDetector = document.getElementById("span-detector");
const navbar = document.querySelector(".navbar");
const section1 = document.querySelector(".section-1");
if(document.querySelector(".profile-submenu"))
var signout = document.querySelector(".profile-submenu").lastChild;
window.addEventListener("load",function(){
    this.console.log("here");
    const clients = ["EVERYONE","FITNESS FREAKS","VEGANS"];
    typeWriter(spanDetector,clients);
});

function typeWriter(spanDetector,clients){
    let text = "";
    let wordIndex = 0;
    let isDeleting = false;
    let wait = 100;
    function typer(){
        wait = 75;
        const word = clients[wordIndex];
        if(isDeleting == false){
            text = word.substring(0,text.length+1);
            spanDetector.textContent = text;
            if(text.length == word.length){
                isDeleting = true;
                wait = 1500;
            }
        }else{
            text = word.substring(0,text.length-1);
            spanDetector.textContent = text;
            if(text.length == 0){
                isDeleting = false;
                wordIndex = (wordIndex+1)%clients.length;
                wait = 100;
            }
        }
        setTimeout(function(){
            typer();
        },wait);
    }
    typer();
}
window.addEventListener("scroll",function(){
    if(window.pageYOffset > section1.offsetTop){
        navbar.classList.add("sticky-bar");
    }else{
        navbar.classList.remove("sticky-bar");
    }
});
signout.addEventListener("click",async function(e){
    console.log("rahul");
    e.preventDefault();
    const backendRes = await  axios.get("/api/users/signout");
    if(backendRes.data.status == "Success"){
        location.reload();
    }else{
        alert("Sign out Failed");
    }
});
