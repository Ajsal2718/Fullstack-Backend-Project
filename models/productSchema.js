const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type:String,
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
    },
    category:{
        type: String,
    },
    // subcategory:{
    //     type:String,
    // },
    Image:{
        type:String,
    },
    qty:{
        type:Number, 
        default:1
    }
},
{timestamps:true}
);

module.exports = mongoose.model('Products',productSchema)