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
app.use(cors("https://badbankmit-e7fce5c065f0.herokuapp.com/"));

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

app.post("/accounts/deposit", async (req, res) => {
   try {
      const { email, amount } = req.body;

      console.log("Email:", email);
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

/*

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
// import session from "express-session";
import mongoose from "mongoose";
import Account from "./models/account.js";

import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
   "mongodb+srv://jredman92:volcom88@badbankapp.ucazng2.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
   }
}
run().catch(console.dir);

const app = express();
mongoose.set("strictQuery", false);

app.use(bodyParser.json());

// app.use(
//    session({
//       secret: "password",
//       resave: false,
//       saveUninitialized: false,
//    })
// );

app.use(
   cors({
      origin: "http://localhost:3000", // Replace with your frontend application's URL
   })
);
app.options("*", cors());

const PORT = process.env.PORT || 5000;

mongoose
   .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log("Connected to MongoDB");
   })
   .catch((error) => {
      console.log("Error connecting to MongoDB:", error);
   });

/*
const authenticate = (req, res, next) => {
   // Check if the user is authenticated
   if (!req.session.user) {
      // If the user is not authenticated, return an error response
      return res.status(401).json({ error: "Unauthorized" });
   }

   // If the user is authenticated, proceed to the next middleware or route handler
   next();
};



// Get the directory path of the current module using `import.meta.url`

app.get("/", (req, res) => {
   res.send("Hello, World!");
});

app.post("/api/accounts", async (req, res) => {
   try {
      const { name, email, password } = req.body;

      // Create a new account instance
      const newAccount = new Account({
         name,
         email,
         password,
         balance: 0,
         transactions: [],
      });

      // Save the new account to the database
      const savedAccount = await newAccount.save();

      // Return the saved account as the API response
      res.status(201).json(savedAccount);
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Account creation failed" });
   }
});

app.post("/api/deposit", async (req, res) => {
   try {
      const { email } = req.body;
      const { amount } = req.params;
      console.log("Email:", email);
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
/*
app.post("/api/login", async (req, res) => {
   try {
      // Check the user credentials
      const { email, password } = req.body;
      const user = await Account.findOne({ email, password });

      if (!user) {
         return res.status(401).json({ error: "Invalid credentials" });
      }

      // Store the authenticated user in the session
      req.session.user = user;

      // Return a success response
      res.json({ message: "Login successful" });
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Login failed" });
   }
});

/*
app.post("/api/balance", async (req, res) => {
   try {
      const { email } = req.body;

      // Find the account in the database based on the email
      const account = await Account.findOne({ email });

      if (!account) {
         return res.status(404).json({ error: "Account not found" });
      }

      // Return the balance of the account
      res.json({ balance: account.balance });
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to retrieve balance" });
   }
});


app.post("/api/withdraw", async (req, res) => {
   try {
      const { email, amount } = req.body;

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


app.listen(PORT, () => console.log("Listening on port " + PORT));


*/
