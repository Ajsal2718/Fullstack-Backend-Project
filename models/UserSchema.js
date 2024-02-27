const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true,   
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
        // confirmPassword: {
        //     type: String,
        //     required: [true, 're enter your password'],
        //     //only work for save and create
        //     validate: {
        //         validator: function (val) {
        //             return val === this.password
        //         },
        //         message: 'Password and confirm password is not same'
        //     }
        // },
        // isAdmin:{
        //     type:Boolean,
        //     default:false
        // }
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