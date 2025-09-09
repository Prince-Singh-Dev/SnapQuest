const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Username is required"],
            unique:true,
            trim:true,
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String,
            required:[true,"Password is required"],
            minlength:6,
        },
        bio:{
            type:String,
            default:"",
            trim:true,
            maxlength : 500,
        },
        profilePic:{
            type:String,
            default:"",
        },
        followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        badges:[String],
        isAdmin:{
            type:Boolean,
            default:false,
        },
        perks:{
            type:Number,
            default:0,
        },
    },
    {
        timestamps:true,
    }
);

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// To compare entered password with the hashed password

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

module.exports = mongoose.model("User",userSchema);
