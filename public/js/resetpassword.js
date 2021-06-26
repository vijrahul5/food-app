const resetform = document.querySelector(".signup-form");

resetform.addEventListener("submit",async function(e){
    e.preventDefault();
    var formData = {
        password: resetform.password.value,
        confirmPassword: resetform.confirmPassword.value
    };
    resetform.password.value = "";
    resetform.confirmPassword.value = "";
    let resetToken = window.location.href.split("/").pop();
    let path = "/api/users/resetpassword/" + resetToken;
    console.log(path);
    const backendRes = await axios.patch(path,formData);
    console.log(backendRes.data);
    if(backendRes.data.status == "Success"){
        alert("Password Reset");
        location.assign("/");
    }else{
        alert("Invalid Reset Link");
    }
});