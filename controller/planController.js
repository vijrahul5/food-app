const planModel = require("../model/planModel"); // Requires the plan model created in planmodel.js

async function getAllPlans(req,res){
    try{

        let plans = await planModel.find(); // find function returns a promise which is waited to be resolved, If resolved the value returned is the whole collection 
        res.status(200).json({ //  We send the plans to the user
            status: "Success",
            data: plans
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: "Error Occurred",
            err
        });
    }
}

async function createPlan(req,res){ //  The function is declared async because it involves async function calls
    let receivedPlan = req.body; //  This is the plan we recieve in the POST request's body
    try{

        let createdPlan = await planModel.create(receivedPlan); // Creates a new plan in our Database which returns a promise and we 
                                                                // await the promise till it is resolved else throw error, 
        
        res.status(200).json({ // If the plan has been create, we send a response to the client informing the same
            status:"Success",
            data: createdPlan
        });

    }catch(err){ // If the promise is rejected, we catch the thrown error in this block and send it to the client

        console.log(err.message);
        res.status(501).json({
            status: "Error Occurred",
            error: err.message
        });
    }
}

async function getPlan(req,res){
    let id = req.params.id; // Extracts the id of the particular plan
    try{
        let plan = await planModel.findById(id); // Finds the plan by its id and returns a promise that is waited
        res.status(200).json({
            status:"Success",
            data: plan
        });

    }catch(err){
        console.log(err);
        res.status(404).json({
            status: "Error Occurred",
            err
        });
    }
}

async function updatePlan(req,res){
    let id = req.params.id; // Extracts id of the plans
    try{

        let plan = await planModel.findById(id); //  Finds the plan by id and returns a promise which is waited to be resolved
        let receivedPlan = req.body; // Updating the plan
        for( var key in receivedPlan){
            plan[key] = receivedPlan[key];
        }
        let updatedPlan = await plan.save(); // Now, saving the updation of the plan in the database, which also returns a promise which is waited upon
        res.status(200).json({
            status: "Success",
            data: updatedPlan
        });

    }catch(err){

        console.log(err);
        res.status(501).json({
            status: "Error Occurred",
            err
        });
    }
}

async function deletePlan(req,res){
    let id = req.params.id; // Extracts id
    try{
        let deletedPlan = await planModel.deleteOne({_id : id}); // Deletes plan having extracted id
        res.status(200).json({
            status: "Success",
            data: deletedPlan
        });
    }catch(err){
        console.log(err);
        res.status(501).json({
            status: "Error Occured",
            err
        })
    }
}
 // Exporting all the controller functions to the specific Router mini app
module.exports.getAllPlans = getAllPlans;
module.exports.getPlan = getPlan;
module.exports.createPlan = createPlan;
module.exports.updatePlan = updatePlan;
module.exports.deletePlan = deletePlan;