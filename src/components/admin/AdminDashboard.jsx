import { useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';


export const AdminDashboard = () => {

const columns =[
    {field:"_id",headerName:"ID",width:200},
    {field:"specialization",headerName:"Specialization",width:200},
    {field:"qualification",headerName:"Qualification",width:200},
    {field:"experience",headerName:"Experience",width:200},
    {field:"about",headerName:"About",width:200},
    {field:"contactNum",headerName:"Contact",width:200},
    
]

const [doctors, setdoctors] = useState([])

const getAllDoctors = async()=>{
    const res = await axios.get("/doctor/all")
    setdoctors(res.data.data)
}


useEffect(()=>{
    getAllDoctors()
},[])
  return (
    <div style={{textAlign:"center"}}>
        <DataGrid 
        rows={doctors}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}>
        </DataGrid>

    </div>
  )
}
