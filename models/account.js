import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   balance: {
      type: Number,
      default: 0,
   },
   transactions: {
      type: Array,
      default: [],
   },
});

const Account = mongoose.model("Account", accountSchema);

export default Account;
