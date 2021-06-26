const logintext = document.querySelector(".login-text");
const signuptext = document.querySelector(".signup-text");
const login = document.querySelector(".login");
const signup = document.querySelector(".signup");
const signupform = document.querySelector(".signup .signup-form");
const loginform = document.querySelector(".login .signup-form");
const forgotpassword = document.querySelector(".login a");
const reset = document.querySelector(".resetform");
const resetform = document.querySelector(".resetform .signup-form");

var check = "signup";

function formhandler(fm){
    if(check == "signup"){
        if(fm == "signup"){
            return;
        }else{
            signuptext.classList.remove("switch");
            logintext.classList.add("switch");
            signup.classList.add("hide");
            login.classList.remove("hide");
            check = "login";
        }
    }else{
        if(fm == "signup"){
            signuptext.classList.add("switch");
            logintext.classList.remove("switch");
            signup.classList.remove("hide");
            login.classList.add("hide");
            check = "signup";
        }else{
            return;
        }
    }
}

signupform.addEventListener("submit",async function(e){
    e.preventDefault();
    var formData = {
        name: signupform.name.value,
        email: signupform.email.value,
        password: signupform.password.value,
        confirmPassword: signupform.confirmPassword.value,
        city: signupform.city.value,
        state: signupform.state.value,
        address: signupform.address.value
    };
    signupform.name.value = "";
    signupform.email.value= "";
    signupform.password.value= "";
    signupform.confirmPassword.value= "";
    signupform.city.value= "";
    signupform.state.value= "";
    signupform.address.value= "";
    const backendRes = await axios.post("/api/users/signup",formData);
    if(backendRes.data.status == "Success"){
        alert("Sign Up Complete");
    }else{
        alert("Account With Same Email Already Exists");
    }
});

loginform.addEventListener("submit",async function(e){
    e.preventDefault();
    var formData = {
        email: loginform.email.value,
        password: loginform.password.value
    };
    loginform.email.value = "";
    loginform.password.value = "";
    const backendRes = await axios.post("/api/users/login",formData); // Using axios to send a post request to our api
    console.log(backendRes.data);
    if(backendRes.data.status == "User Logged In"){
        alert("User Logged In");
        location.assign("/");
    }else{
        alert("Login Failed");
    }
})

forgotpassword.addEventListener("click",function(e){
    console.log("here");
    reset.classList.remove("hide");
});

resetform.addEventListener("submit",async function(e){
    console.log("here");
    e.preventDefault();
    var formData = {
        email: resetform.email.value,
    };
    resetform.email.value = "";
    const backendRes = await axios.patch("/api/users/forgotpassword",formData);
    console.log(backendRes.data);
    if(backendRes.data.status == "Reset Email Sent"){
        alert("Reset Email Sent");
        // location.reload();
    }else{
        alert("Error Occurred");
    }
});

