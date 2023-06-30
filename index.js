import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Account from "./models/account.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const uri =
   "mongodb+srv://jredman92:volcom88@badbankapp.ucazng2.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

mongoose
   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
      console.log("Connected to MongoDB");
   })
   .catch((error) => {
      console.log("Error connecting to MongoDB:", error);
   });

app.post("/accounts", async (req, res) => {
   try {
      const { name, email, password } = req.body;

      const newAccount = new Account({
         name,
         email,
         password,
         balance: 0,
         transactions: [],
      });

      const savedAccount = await newAccount.save();

      res.status(201).json(savedAccount);
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Account creation failed" });
   }
});
app.get("/accounts", async (req, res) => {
   const { email, password } = req.query;

   console.log("Received email:", email);
   console.log("Received password:", password);

   try {
      const account = await Account.findOne({ email, password });

      console.log("Found account:", account);

      if (account) {
         // User account found
         res.status(200).json(account);
      } else {
         // User account not found
         res.status(404).json({ error: "User does not exist" });
      }
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching account" });
   }
});

// Handle account creation for Google OAuth2 signup
app.post("/accounts", async (req, res) => {
   try {
      const { googleId, name, email } = req.body;

      // Account doesn't exist, create a new one without a password
      const newAccount = new Account({
         name,
         email,
         googleId,
         balance: 0,
         transactions: [],
      });

      const savedAccount = await newAccount.save();

      res.status(201).json(savedAccount);
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Account creation failed" });
   }
});

app.post("/accounts/deposit", async (req, res) => {
   try {
      const { email, amount } = req.body;

      // Find the account in the database
      const account = await Account.findOne({ email });
      if (!account) {
         return res.status(404).json({ error: "Account not found" });
      }

      // Update the account's balance and save it to the database
      account.balance += amount;
      const updatedAccount = await account.save();

      // Return the updated account as the API response
      res.json(updatedAccount);
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to process deposit" });
   }
});

app.post("/accounts/withdraw", async (req, res) => {
   try {
      const { email, amount } = req.body;
      console.log("Email:", email);

      // Find the account in the database based on the email
      const account = await Account.findOne({ email });

      if (!account) {
         return res.status(404).json({ error: "Account not found" });
      }

      // Check if the account has sufficient balance for withdrawal
      if (account.balance < amount) {
         return res.status(400).json({ error: "Insufficient balance" });
      }

      // Update the account's balance and save it to the database
      account.balance -= amount;
      const updatedAccount = await account.save();

      // Return the updated account as the API response
      res.json(updatedAccount);
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to process withdrawal" });
   }
});

app.listen(process.env.PORT || 5000, () => {
   console.log("Server is listening on port " + PORT);
});
