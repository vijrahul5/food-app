const userModel = require("../model/userModel");

async function getProfile(req,res){
    let id = req.id;
    try{
        let user = await userModel.findById(id).select("+password");
        res.status(200).json({
            status: "Success",
            data: user
        });

    }catch(err){
        console.log(err);
        res.status(501).json({
            status: "Error Occurred",
            err
        });
    }
}

async function getAllProfiles(req,res){
    try{

        let users = await userModel.find();
        res.status(200).json({
            status: "Success",
            data: users
        });

    }catch(err){
        console.log(err);
        res.status(501).json({
            status: "Error Occurred",
            err
        });
    }
}

async function updateProfile(req,res){
    let id = req.id;
    try{
        let receiveduser = req.body;
        let user = await userModel.findById(id);
        for(var key in receiveduser){
            user[key] = receiveduser[key];
        }
        let updatedUser = await user.save();
        res.status(200).json({
            status: "Success",
            data: updatedUser
        });
    }catch(err){
        console.log(err);
        res.status(501).json({
            status: "Error Occurred",
            err
        });
    }
}

async function deleteProfile(req,res){
    let id = req.id;
    try{

        let deletedUser = await userModel.deleteOne({_id : id});
        res.status(200).json({
            status: "Success",
            data: deletedUser
        });

    }catch(err){
        console.log(err);
        res.status(501).json({
            status: "Error Occurred",
            err
        });
    }
}

module.exports.getAllProfiles = getAllProfiles;
module.exports.getProfile = getProfile;
module.exports.updateProfile = updateProfile;
module.exports.deleteProfile = deleteProfile;