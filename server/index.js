const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config({ path: require("path").resolve(__dirname, ".env.local") });
require("dotenv").config({ path: require("path").resolve(__dirname, ".env.production") });

const stripe = require('stripe')(process.env.PAYMENT_GATEWAY_KEY);

const decoded = Buffer.from(process.env.FIREBASE_ADMIN_KEY, 'base64').toString('utf-8')
const serviceAccount = JSON.parse(decoded)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tahmid-sarker.github.io"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
initializeApp({
  credential: cert(serviceAccount)
});

// Create Token (Create)
app.post("/jwt", (req, res) => {
  const userEmail = req.body;
  const token = jwt.sign(userEmail, process.env.JWT_ACCESS_SECRET, {expiresIn: '10d'});
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });
  res.send({token});
})

// Verify Cookie Token:
const VerifyJWTToken = (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(401).send({message: "Unauthorize Access"})
  }
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, decode) => {
    if(error) {
      return res.status(401).send({message: "Unauthorize Access"})
    }
    req.decode = decode;
    next();
  })
}

// Verify Firebase Token:
const VerifyFirebaseToken = async(req, res, next) => {
  const authHeader = req.headers.authorization
  if(!authHeader) {
    return res.status(401).send({message: "Unauthorize Access"})
  }
  const token = authHeader.split(" ")[1];
  const decode = await getAuth().verifyIdToken(token)
  req.decode = decode;
  next();
}

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@main-cluster.n46zypt.mongodb.net/?retryWrites=true&w=majority&appName=main-cluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const biodataCollection = client.db("biodataDB").collection("biodatas");
const favouriteCollection = client.db("biodataDB").collection("favourites")
const userCollection = client.db("userDB").collection("users");
const marriageCollection = client.db("marriageDB").collection("stories");
const premiumRequests = client.db("premiumDB").collection("requests");
const paymentCollection = client.db("paymentDB").collection("payments");
const messageCollection = client.db("messageDB").collection("messages");

// USER PART:
// Create a User (Create)
app.post("/users", VerifyFirebaseToken, async (req, res) => {
  const newUser = req.body;
  if(newUser.email !== req.decode.email) {
    return res.status(403).send({message: "Forbidden Access"});
  } else {
    const result = await userCollection.insertOne(newUser);
    res.send(result);
  }
});

// Get all Users (Read)
app.get("/users", VerifyJWTToken, async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result);
});

// Get single User by Email (Read)
app.get("/user", VerifyJWTToken, async (req, res) => {
  const email = req.query.email;
  const filter = { email: email };
  const result = await userCollection.findOne(filter);
  res.send(result);
});

// Get user logged info (Update)
app.patch("/users/login", VerifyFirebaseToken, async (req, res) => {
  const { email, lastSignInTime } = req.body;
  if(email !== req.decode.email) {
    return res.status(403).send({message: "Forbidden Access"});
  } else {
    const filter = { email: email };
    const updateDoc = {
      $set: {
        lastSignInTime: lastSignInTime,
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  }
});

// Update partial user info (Update)
app.patch("/dashboard/update-profile", VerifyJWTToken, async (req, res) => {
  const { email, name, photo } = req.body;
  const filter = { email: email };
  const updateDoc = {
    $set: {
      name: name,
      photo: photo,
    },
  };
  const result = await userCollection.updateOne(filter, updateDoc);
  res.json(result);
});


// BIODATA PART:
// Get All Biodata (Read)
app.get("/biodatas", async (req, res) => {
  const result = await biodataCollection.find().sort({ age: 1 }).toArray(); // 1 for ascending order by age and -1 for descending order
  res.send(result);
});

// Get Biodata by ID (Read)
app.get("/biodata/:id", VerifyJWTToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const filter = { biodataId: id };
  const result = await biodataCollection.findOne(filter);
  if (!result) {
    return res.status(404).send({ message: "Biodata not found" });
  } else {
    res.send(result);
  }
});

// Create Biodata by ID (Create)
app.post('/biodata/:biodataId', VerifyJWTToken, async (req, res) => {
    const biodata = req.body;
    const result = await biodataCollection.insertOne(biodata);
    res.send(result);
});

// Update Biodata by ID (Update)
app.patch('/biodata/:biodataId', VerifyJWTToken, async (req, res) => {
    const biodataId = parseInt(req.params.biodataId);
    const updateFields = req.body;
    const filter = { biodataId: biodataId };
    const updateDoc = { $set: updateFields };
    const result = await biodataCollection.updateOne(filter, updateDoc);
    res.send(result);
});

// Get feature members (Read)
app.get('/featured-members', async (req, res) => {
  const result = await biodataCollection.find({ premium: "true" }).sort({ age: 1 }).limit(6).toArray();
  res.send(result);
});

// PAYMENT PART:
// Step 3: Create a Payment Intent endpoint (Create)
app.post('/create-payment-intent', VerifyJWTToken, async (req, res) => {
  const { amountInCents } = req.body;
  if (!amountInCents || typeof amountInCents !== 'number') {
    return res.status(400).send({ error: 'Invalid amount' });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // must be integer
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Save payment info to the database (Create)
app.post('/payments', VerifyJWTToken, async (req, res) => {
  const paymentInfo = req.body;
  const result = await paymentCollection.insertOne(paymentInfo);
  res.send(result);
});

// Get payment history by Emaill (Read)
app.get('/payments', VerifyJWTToken, async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email query param is required" });
  }

  const result = await paymentCollection
    .find({ email })
    .sort({ date: -1 }) // newest first
    .toArray();

  res.json(result);
});

// CONTACT MESSAGE PART:
// Contact Messages (Create)
app.post('/contact-message', async (req, res) => {
  const message = req.body;
  const result = await messageCollection.insertOne(message);
  res.send(result);
});

// Get all contact messages (Read)
app.get('/contact-messages', VerifyJWTToken, async (req, res) => {
  const result = await messageCollection.find().sort({ date: -1 }).toArray();
  res.send(result);
});

// Delete a contact message (Delete)
app.delete('/contact-messages/:id', VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const result = await messageCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// USER DASHBOARD:
// Create a Biodata (Create)
app.post('/biodata', VerifyJWTToken, async (req, res) => {
  const biodata = req.body;
  const result = await biodataCollection.insertOne(biodata);
  res.send(result);
});

// Get Premium Biodata (Read)
app.get('/premium-biodata', async (req, res) => {
  const filter = { premium: "true" };
  const result = await biodataCollection.find(filter).toArray();
  res.send(result);
});

// Get Biodata by Email (Read)
app.get("/biodata", VerifyJWTToken, async (req, res) => {
  const email = req.query.email;
    const filter = { contactEmail: email };
    const result = await biodataCollection.find(filter).toArray();
    res.send(result);
});

// Send a to Favourite Biodata List (Create)
app.post("/favourite", VerifyJWTToken, async(req, res) => {
  const data = req.body;
  const result = await favouriteCollection.insertOne(data);
  res.send(result); 
});

// Get Favourite Boidata List by User Email (Read)
app.get("/favourites", VerifyJWTToken, async(req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ message: "Email query param is required" });
  }
  const result = await favouriteCollection.find({ userEmail: email }).toArray();
  res.send(result);
});

// Delete a Favourite Biodata (Delete)
app.delete("/favourite/:id", VerifyJWTToken, async(req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "Favourite ID is required" });
  const result = await favouriteCollection.deleteOne({ _id: id });
  res.send(result);
});

// Success Stories (Create)
app.post('/stories', async (req, res) => {
  const stories = req.body;
  const result = await marriageCollection.insertOne(stories);
  res.send(result);
});

// Get top 4 Success Stories (Read)
app.get('/stories/top', async (req, res) => {
  const result = await marriageCollection.find().sort({ dateOfMarriage: -1 }).limit(4).toArray();
  res.send(result);
});

// Get all Success Stories (Read)
app.get('/stories', VerifyJWTToken, async (req, res) => {
  const result = await marriageCollection.find().sort({ dateOfMarriage: -1 }).toArray();
  res.send(result);
});

// Send Request for Premium (Create)
app.post('/request-premium', VerifyJWTToken, async (req, res) => {
  const { email } = req.body;
  const existing = await premiumRequests.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Request already sent' });
  const result = await premiumRequests.insertOne({
    email,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  });
  res.send(result);
});

//ADMIN DASHBOARD:
// All users (Read)
app.get('/users', VerifyJWTToken, async (req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
});

// Delete a Biodata by ID (Delete)
app.delete('/biodata/:id', VerifyJWTToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await biodataCollection.deleteOne({ biodataId: id });
  res.send(result);
});

// Make Admin or Remove Admin (Update)
app.patch('/users/admin/:id', VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const { role } = req.body; // either "admin" or "user"
  const result = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role: role } }
  );
  res.send(result);
});

// Toggle Premium Status (Update)
app.patch('/users/premium/:id', VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const { premium } = req.body; // true or false
  const result = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { premium: premium } }
  );
  res.send(result);
});

// Remove User (Delete)
app.delete('/users/:id', VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Delete Success Story (Delete)
app.delete("/stories/:id", VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const result = await marriageCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// Get all premium requests (Read)
app.get('/premium-requests', VerifyJWTToken, async (req, res) => {
  try {
    const requests = await premiumRequests.find().toArray();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch premium requests' });
  }
});

// Get a premium request data by email (Read)
app.get('/premium-requests', VerifyJWTToken, async (req, res) => {
  const email = req.query.email;
  const filter = { email };
  const result = await premiumRequests.findOne(filter);
  res.send(result);
});

// Update status (approve/remove approve) of a premium request (Update)
app.patch('/premium-requests/:id', VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body; // "approved" or "pending"
  if (!['approved', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const result = await premiumRequests.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Update user premium status based on request approval (Update)
app.patch('/users/email/:email', VerifyJWTToken, async (req, res) => {
  const email = req.params.email; // this will be decoded automatically by Express
  const { premium } = req.body;
  try {
    const result = await userCollection.updateOne(
      { email: email },
      { $set: { premium: String(premium) } } // store as string
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user premium status' });
  }
});

// Delete a premium request (Delete)
app.delete('/premium-requests/:id', VerifyJWTToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await premiumRequests.deleteOne({ _id: new ObjectId(id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// Get all payment records (Read)
app.get('/all-payments', VerifyJWTToken, async (req, res) => {
  const result = await paymentCollection.find().sort({ date: -1 }).toArray();
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("Welcome to Bengal Matrimony Server!");
});

app.listen(port, () => {
  console.log(`Server is running on PORT: http://localhost:${port}`);
});

module.exports = app;
