import React,{useEffect,useState} from 'react'

const recommendations = () => {
  const [projects,setProjects] = useState([])

    useEffect(()=>{

    fetch("http://localhost:3000/api/recommendations/projects/S1")
    .then(res=>res.json())
    .then(data=>setProjects(data))

    },[])

    return(

    <div>

    <h2>Recommended Projects</h2>

    {projects.map((item,i)=>(

    <div key={i} style={{border:"1px solid gray",padding:"10px",margin:"10px"}}>

    <h3>{item.project.title}</h3>

    <p>Score: {(item.score*100).toFixed(0)}%</p>

    <p>{item.explanation}</p>

    </div>

    ))}

    </div>

    )
}

export default recommendations
