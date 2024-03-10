const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true, 
            trim:true  
        },
        email:{
            type:String,
            required:true,
            unique:true  //email should be unique for every user
        },
        password:{
            type:String,
            required:true
        },
        address:{
            type:Object,
        },
        cart:Array,
        wishlist:Array,
        orders:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            }
        ]
    },
    {
        timestamps:true
    }
);
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
module.exports = mongoose.model('User',UserSchema)