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
    Image:{
        type:String,
    },
},
{timestamps:true}
);

module.exports = mongoose.model('Products',productSchema)