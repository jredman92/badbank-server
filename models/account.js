import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
   name: {
      type: String,
      required: false,
   },
   email: {
      type: String,
      required: false,
   },
   password: {
      type: String,
      required: false,
   },
   balance: {
      type: Number,
      default: 0,
   },
   transactions: {
      type: Array,
      default: [],
   },
   googleId: {
      type: String,
   },
   displayName: {
      type: String,
   },
});

const Account = mongoose.model("Account", accountSchema);

export default Account;
