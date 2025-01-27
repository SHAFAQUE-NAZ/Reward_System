import mongoose from "mongoose";
import express, { response } from "express";


const router = express.Router();
const Schema=mongoose.Schema;

const nominations = new mongoose.Schema({
    _id:Schema.Types.ObjectId,
  fullName: String,
  designation: String,
  nominatedBy: String,
  criteria: {
    type: Array,
  },
  department: String,
  praise: String,
  likes: [ {type: Schema.Types.ObjectId,
    ref:'employees',}],
  dislikes:[ {type: Schema.Types.ObjectId,
    ref:'employees',}],
      
});

const Nominated = new mongoose.model("Nomination", nominations);


router.post("/", async (req, res) => {
  const {
    _id,
    fullName,
    designation,
    nominatedBy,
    criteria,
    department,
    praise,
  } = req.body;

  const nom = new Nominated({
      _id,
    fullName,
    designation,
    nominatedBy,
    criteria,
    department,
    praise,
  });

  await nom
    .save()
    .then(() => {
      res.send({ message: "Succesduflt Nominated" });
    })
    .catch((e) => {
      console.log("Error occures while Nominating", e);
    });
});


router.get('/', async(req,res)=>{
    try {
      const emp = await Nominated.find();
      //    res.json(emp);
      res.send(emp);
    } catch (err) {
      res.send(err);
    }
 
})


//add like id to Nominations and remove from dislike
router.put('/:id', async(req,res)=>{
  const { like } = req.body;
try {
   const liked = await Nominated.findByIdAndUpdate({ _id: req.params.id },{$addToSet:{likes:like}});
   const removeLikes = await Nominated.findByIdAndUpdate({ _id: req.params.id },{$pull:{dislikes:like}});
    res.json(like);
    
  
  } catch (error) {
    res.json({ message: error.message });
  }
})

//add dislike to Nominations and remove from like
router.put('/dislike/:id', async(req,res)=>{
  const { dislike } = req.body;
try {
   const disliked = await Nominated.findByIdAndUpdate({ _id: req.params.id },{$addToSet:{dislikes:dislike}});
   const removeLikes = await Nominated.findByIdAndUpdate({ _id: req.params.id },{$pull:{likes:dislike}});
    res.json(dislike);
   // console.log(disliked.dislikes);
  } catch (error) {
    res.json({ message: error.message });
  }
})


//get nominations by ids
// router.get('/:id', async(req,res)=>{
//   try {
//     const emp = await Nominated.find({ _id: req.params.id});
//       res.json(emp);
//     res.send(emp);
//   } catch (err) {
//     res.send(err);
//   }

// })

export default router;
