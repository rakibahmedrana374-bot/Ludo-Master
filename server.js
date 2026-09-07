require("dotenv").config();
const express=require("express");
const cors=require("cors");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {Pool}=require("pg");

const app=express();
app.use(cors());
app.use(express.json());

const PORT=process.env.PORT||3000;
const JWT_SECRET=process.env.JWT_SECRET||"change-this-secret";
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?{rejectUnauthorized:false}:false});

async function init(){
 if(process.env.DATABASE_URL){
  await pool.query(`
   CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,name VARCHAR(100) NOT NULL,phone VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,balance NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
   CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id),trx_id VARCHAR(100) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,method VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
   CREATE TABLE IF NOT EXISTS tournaments(
    id SERIAL PRIMARY KEY,name VARCHAR(120) NOT NULL,entry_fee NUMERIC(12,2) NOT NULL,
    prize NUMERIC(12,2) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
  `);
 }
}
function auth(req,res,next){
 try{const h=req.headers.authorization||"";const token=h.startsWith("Bearer ")?h.slice(7):null;
 if(!token)return res.status(401).json({error:"Login required"});
 req.user=jwt.verify(token,JWT_SECRET);next();}catch(e){res.status(401).json({error:"Invalid token"});}
}
app.get("/",(req,res)=>res.json({ok:true,service:"LudoArena API"}));
app.get("/health",(req,res)=>res.json({status:"healthy"}));

app.post("/api/register",async(req,res)=>{
 try{const {name,phone,password}=req.body;
 if(!name||!phone||!password)return res.status(400).json({error:"Name, phone and password required"});
 const hash=await bcrypt.hash(password,10);
 const r=await pool.query("INSERT INTO users(name,phone,password) VALUES($1,$2,$3) RETURNING id,name,phone,balance",[name,phone,hash]);
 res.status(201).json({message:"Registered",user:r.rows[0]});
 }catch(e){res.status(400).json({error:e.code==="23505"?"Phone already registered":"Registration failed"});}
});

app.post("/api/login",async(req,res)=>{
 try{const {phone,password}=req.body;const r=await pool.query("SELECT * FROM users WHERE phone=$1",[phone]);
 if(!r.rows[0]||!(await bcrypt.compare(password,r.rows[0].password)))return res.status(401).json({error:"Invalid login"});
 const u=r.rows[0],token=jwt.sign({id:u.id,phone:u.phone},JWT_SECRET,{expiresIn:"7d"});
 res.json({token,user:{id:u.id,name:u.name,phone:u.phone,balance:u.balance}});
 }catch(e){res.status(500).json({error:"Login failed"});}
});

app.get("/api/profile",auth,async(req,res)=>{
 const r=await pool.query("SELECT id,name,phone,balance,created_at FROM users WHERE id=$1",[req.user.id]);
 res.json(r.rows[0]||null);
});

app.post("/api/transaction",auth,async(req,res)=>{
 const {trx_id,amount,method}=req.body;
 if(!trx_id||!amount||!method)return res.status(400).json({error:"trx_id, amount and method required"});
 const r=await pool.query("INSERT INTO transactions(user_id,trx_id,amount,method) VALUES($1,$2,$3,$4) RETURNING *",[req.user.id,trx_id,amount,method]);
 res.status(201).json({message:"Transaction submitted",transaction:r.rows[0]});
});

app.get("/api/tournaments",async(req,res)=>{
 if(!process.env.DATABASE_URL)return res.json([]);
 const r=await pool.query("SELECT * FROM tournaments ORDER BY id DESC");res.json(r.rows);
});

app.listen(PORT,async()=>{try{await init();console.log("LudoArena API running on",PORT)}catch(e){console.error(e)}});