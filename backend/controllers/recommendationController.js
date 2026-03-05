const students = require("../dummyData/dummystudents")
const projects = require("../dummyData/dummyprojects")

const {calculateScore} = require("../services/recommendationEngine")

const getRecommendedProjects = (req,res)=>{

const studentId = req.params.studentId

const student = students.find(s=>s.id===studentId)

if(!student)
return res.status(404).json({message:"student not found"})

let results=[]

projects.forEach(project=>{

const result = calculateScore(student,project)

if(result){

results.push({

project,
score:result.score,
explanation:result.explanation

})

}

})

results.sort((a,b)=>b.score-a.score)

res.json(results)

}

module.exports = {getRecommendedProjects}