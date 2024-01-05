import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const emailRegexPattern:RegExp=/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/


export interface Iuser extends Document {
    name: string
    email: string
    password: string
    avatar: {
        public_id: string
        url:string
    }
    role: string
    isVerified: boolean;
    courses: Array<{ courseId: string }>
    comparePassword:(password:string)=>Promise<boolean>
}

const userSchema = new Schema<Iuser>({
    name: {
        type: String,
        required:[true,"Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value)
            },
            message: "Please enter a valid email",
            
        },
        unique:true
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must be a six character"],
        select:false
    },
    avatar: {
        public_id: String,
        url:String
    }
    ,
    role: {
        type:String,
        default:"user"
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    courses: [
        {
            courseId:String
        }
    ]

}, {
    timestamps:true
})

userSchema.pre<Iuser>("save", async function (next) {
    if (!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods={
    comparePassword: async function (enteredPassword: string):Promise<boolean> {
       return await bcrypt.compare(enteredPassword,this.password)
    }
}

const userModel: Model<Iuser> = mongoose.model("User", userSchema)

export default userModel