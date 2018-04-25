const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoUrl = "mongodb://localhost:27017";
const dbName = "parnas";
const dbUrl = mongoUrl + "/" + dbName;

const WallRecordScheme = new Schema({
  comments: Number,
  date: Number,
  likes: Number,
  reposts: Number,
  text: String,
  signer_id: Number,
  _id: Number
})
const WallRecord = mongoose.model("wallRecords", WallRecordScheme);

const ProfileScheme = new Schema({
  first_name: String,
  last_name: String,
  _id: Number
})
const Profile = mongoose.model("profiles", ProfileScheme);

exports.upsertWallRecords = function(wrs){
  mongoose.connect(dbUrl);
  let upsertPromises =  wrs.map(wr => {
    let dbWrRecord = {
      comments: wr.comments.count,
      date: wr.date,
      likes: wr.likes.count,
      reposts: wr.reposts.count,
      text: wr.text,
      signer_id: wr.signer_id,
      _id: wr.id,
    }
    return WallRecord.update({_id: dbWrRecord._id}, dbWrRecord, {upsert: true})
  })

  return Promise.all(upsertPromises)
    .then(_ => mongoose.disconnect())
    .catch(e => mongoose.disconnect())
}

exports.pizza = function(){
  mongoose.connect(dbUrl);
  return WallRecord.aggregate([
    {$match:{signer_id:{"$ne": null}}},
    {$group: {_id: "$signer_id", total: {$sum: "$likes"}}}
  ])
  .sort({total: -1})
}

exports.upsertProfiles = function(profiles){
  mongoose.connect(dbUrl);
  let upsertPromises =  profiles.map(pr => {
    let dbProfile = {
      first_name: pr.first_name,
      last_name: pr.last_name,
      _id: pr.id
    }
    return Profile.update({_id: dbProfile._id}, dbProfile, {upsert: true})
  })

  return Promise.all(upsertPromises)
    .then(_ => mongoose.disconnect())
    .catch(e => mongoose.disconnect())
}

exports.getTopWallRecordsByLikes = function(count = 10){
  mongoose.connect(dbUrl);
  return WallRecord.find({})
    .sort({likes: -1})
    .limit(count)
    .exec()
    .then(results => { mongoose.disconnect(); return results;})
    .catch(e => mongoose.disconnect())
}

exports.getTopWallRecordsByReposts = function(count = 10){
  mongoose.connect(dbUrl);
  return WallRecord.find({})
    .sort({reposts: -1})
    .limit(count)
    .exec()
    .then(results => { mongoose.disconnect(); return results;})
    .catch(e => mongoose.disconnect())
}