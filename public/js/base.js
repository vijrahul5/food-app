const middle = document.querySelector(".middle");
const navbar = document.querySelector(".navbar");
if(document.querySelector(".profile-submenu"))
var signout = document.querySelector(".profile-submenu").lastChild;

window.addEventListener("scroll",function(){
    if(window.pageYOffset > middle.offsetTop){
        navbar.classList.add("sticky-bar");
    }else{
        navbar.classList.remove("sticky-bar");
    }
});
if(signout){
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
}