var activesection = "myprofile";
var as = document.getElementById(activesection);
var asn = document.getElementById(activesection + "nav");

function sectionChange(section){
    if(section == activesection){
        return;
    }else{
        console.log(activesection);
        console.log(section);
        let ns = document.getElementById(section);
        let nsn = document.getElementById(section+"nav");
        asn.classList.remove("active");
        nsn.classList.add("active");
        as.classList.add("hide");
        ns.classList.remove("hide");
        activesection = section;
        as = ns;
        asn = nsn;
    }
}