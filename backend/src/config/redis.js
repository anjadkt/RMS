require('dotenv').config();
const {createClient} = require('redis')

const { REDIS_HOST, REDIS_PORT , REDIS_USERNAME , REDIS_PASSWORD} = process.env ;

const redisClient = createClient({
  username : REDIS_USERNAME,
  password : REDIS_PASSWORD,
  socket : {
    host : REDIS_HOST,
    port : REDIS_PORT
  }
});

redisClient.on("error",(err)=>{
  console.error("Redis Error:", err);
});


const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected");
  }
};

module.exports = { connectRedis, redisClient }