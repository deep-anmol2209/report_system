import mongoose from "mongoose";

const siteSchem= new mongoose.Schema({

    location: {
        type: String,
        required: true
    },

    piuname:{
        type: String,
        required: true
    },

    status:{
        type : Boolean,
        default: true
    },

    employees:[
        {
       type: mongoose.Schema.Types.ObjectId,
         ref: "users"
        }
    ]

})

const Site = mongoose.model("sites", siteSchem);
export default Site;