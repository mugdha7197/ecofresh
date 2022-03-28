import React, { Component,useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { Button } from "@mui/material";
import {FooterContainer} from "../../components/Footer/FooterContainer";
import Navbar from "../../components/Navbar/NavUser"
import { FooterWrapper, HeaderWrapper, MainContent, PageWrapper, BottomContainer, Row,
  Column, Image } from "../LandingPage/LandingPage.style";
import {useNavigate} from 'react-router-dom';
import './Complaints.css';
import TextField from "@mui/material/TextField";
import Select from 'react-select'
import ComplaintsImage from '../../assets/pictures/Complaints.jpg';
import Card from '@mui/material/Card';
import baseURL from '../../config';

function LandingPage(props) {
  const [success,setSuccess] = useState("");
  const [url,setUrl] = useState("");
  const navigate = useNavigate();
  const [api_url,setAPIUrl] = useState(baseURL+'/complaints/allcomplaints/');
  const complaintId_url = baseURL+'/complaints/generateComplaintId';
  const [typeOfComplaint,setTypeOfComplaint] = useState("");
  const [data, setData] = useState('');
  const [search,setSearch] = useState('');
  const [complaint,setComplaint] = useState("");
  const [ComplaintError,setComplaintError] = useState("");
  const complaintType = [
    {value:"Delivery",label:"Delivery Related"},
    {value:"Quality",label:"Quality Related"},
    {value:"Quantity",label:"Quantity Related"},
  ]
  const orderIds = []
  const [errormsg,setErrormsg] = useState("");
  const orderId_url= baseURL+'/complaints/allorders';
  const [complaintId,setComplaintId] = useState('')
  const [orderId,setOrderId] = useState('')
  const fileInput = useRef();
  const userId = localStorage.getItem("emailId")
  axios.post(orderId_url,{data : {'userId': userId}}).then((response) => {
    for (let i = 0; i < response.data.length; i++) {
      orderIds.push({value:response.data[i].orderId,label:response.data[i].orderId});
    }
  });
  const handleChange = (ev) => {
    setSuccess(false)
  }
  
  useEffect(() => {
      const headers = {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
      }
      axios.get(complaintId_url,{headers: headers}).then((response) => {
      setComplaintId(response.data)
    });
  },[data]);

  const handleOrderSelect = (e) =>{
    setOrderId(e.value);
  }

  const handleComplaintTypeSelect = (e) =>{
    setTypeOfComplaint(e.value);
  }

  const handleClick = (id) => {
      navigate(`/complaints/ComplaintResolutionPage/${id}`);
  }

  const handleUpload = (ev) => {
    if(typeOfComplaint.length === 0 || orderId.length === 0 || ComplaintError.length>0 ||
      errormsg.length > 0)
    {
      if(typeOfComplaint.length === 0 || orderId.length === 0)
      {
        alert("Please select value for each dropdown")
      }
      if(ComplaintError.length>0)
      {
        alert("Please enter atleast 15 characters in complaint description")
      }
      else{
        alert(errormsg)
      }
    }
    else
    {
    let file = fileInput.current.files[0];
    let fileParts = fileInput.current.files[0].name.split('.');
    let fileName = complaintId;
    let fileType = fileParts[1];
    console.log("Preparing the upload");
    axios.post("http://localhost:3001/uploadToS3",{
      fileName : fileName,
      fileType : fileType
    })
    .then(response => {
      var returnData = response.data.data.returnData;
      var signedRequest = returnData.signedRequest;
      var url = returnData.url;
      setUrl(url)
      console.log("Recieved a signed request " + signedRequest);
      
      var options = {
        headers: {
          'Content-Type': fileType
        }
      };
      axios.put(signedRequest,file,options)
      .then(result => {
        console.log("Response from s3")
        setSuccess(true);
      })
      .catch(error => {
        alert("ERROR " + JSON.stringify(error));
      })
    })
    .catch(error => {
      alert(JSON.stringify(error));
    })

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
  }
  axios.post("http://localhost:3001/complaints/addcomplaint",{headers: headers, 
  data : {
    complaintId : complaintId,
    complaintType: typeOfComplaint,
    description: complaint,
    orderId: orderId,
    photoUrl: 'https://ecofresh-complaint.s3.us-west-2.amazonaws.com/'+complaintId,
    userEmail: userId,
  }});
  }
}

  const handlecomplaint = (e) =>{
    if(e.target.value.length < 15){
      setComplaintError("Complaint should be atleast 15 characters long");
      setErrormsg("Complaint should be atleast 15 characters long");
    }
    else{
      setComplaintError("");
      setErrormsg("");
    }
    setComplaint(e.target.value);
  }

    return (
      <PageWrapper>
        
      <HeaderWrapper><Navbar /></HeaderWrapper>
        <BottomContainer> 
            <MainContent>
              <img src={ComplaintsImage} width="100%" height="300px"/>
              <h1 style={{width: 'fit-content',margin: '0 auto'}}>Complaint Details</h1>
          <Card>
                  <hr></hr>
              <Row style={{height:"50px",alignItems:"center"}}>
                  <Column  style={{ backgroundColor:'#1d3124',color:'white'}}> Select OrderId : </Column>
                  <Column style={{ backgroundColor:'orange'}}><Select options={orderIds} onChange={handleOrderSelect} value={orderIds[0]} /></Column>
              </Row>
              <Row style={{height:"50px",alignItems:"center"}}>
                  <Column  style={{ backgroundColor:'#1d3124',color:'white'}}> Select Complaint Type : </Column>
                  <Column style={{ backgroundColor:'orange'}}><Select options={complaintType} onChange={handleComplaintTypeSelect}/></Column>
                  
              </Row>
              <Row style={{height:"50px",alignItems:"center"}}>
                  <Column  style={{ backgroundColor:'#1d3124',color:'white'}}> Enter Complaint Description : </Column>
                  <Column style={{ backgroundColor:'orange'}}><TextField style ={{width: '100%',backgroundColor:'white'}}onChange={handlecomplaint} type="text"/></Column>
                  
              </Row>
              {complaint.length < 15 && complaint.length!=0 && ComplaintError ? (
                            <Row style={{height:"50px",alignItems:"center"}}>
                            <Column></Column>
                            <Column><p style={{color:"red"}}>{ComplaintError}</p></Column>
                            <Column></Column> 
                        </Row>)
              :null}
              
              <Row style={{height:"50px",alignItems:"center"}}>
                  <Column style={{ backgroundColor:'#1d3124',color:'white'}}> Upload Image :</Column>
                  <Column>  <input onChange={handleChange} ref={fileInput} type="file"/></Column>  
              </Row>
              <Row style={{height:"50px"}}>
                <Column></Column>
                <Column>
              <Button style={{backgroundColor:"orange",
                    float:'right'}} onClick={handleUpload}>Submit Complaint</Button> </Column>
              </Row>
              <hr></hr>
          </Card>
          </MainContent>
          </BottomContainer>
          <FooterContainer />
          </PageWrapper>
    );

}
export default LandingPage;