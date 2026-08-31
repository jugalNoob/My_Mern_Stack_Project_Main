import  mongoose from  'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },       // unique name
  price: { type: Number, required: true },
  age: { type: Number, required: true },
  birthDate: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  email: { type: String, required: true },      // unique email
  hobbies: { type: [String], required: true },
  country: { type: String, required: true },
  bio: { type: String, required: true },
  isEligible: { type: Boolean, required: true },
  gender: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true }
});


userSchema.index({ name: "text" });

userSchema.index({ country: 1, price: 1, _id: 1 });

userSchema.index({ country: 1, age: 1, _id: 1 });

userSchema.index({ email: 1 }, { unique: true });

userSchema.index({ date: -1 });

// inboxSchema.index(
//   { processedAt: 1 },
//   { expireAfterSeconds: 604800 } // 7 days
// );


/// Create A Method System --------------------->>


Date.prototype.lastYear=function(){
   return this.getFullYear() - 1;
}


userSchema.methods.mysimple = async function () {
  const date = new Date();
  this.YearOld = (date.getFullYear() - 1).toString();
  await this.save();
  return this.YearOld;
};



export const RegisterGet = mongoose.model("Manapis", userSchema);
//  export const RegisterGet = mongoose.model("Manapis", userSchema);

