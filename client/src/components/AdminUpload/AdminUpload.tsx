import React, { ComponentProps } from 'react';
import { useState, useEffect } from "react";
import { Navigate } from 'react-router';
import { useNavigate } from "react-router-dom";

interface AdminUploadProps{
    token: string
}
//https://reactjs.org/docs/forms.html 
function AdminUpload(props: AdminUploadProps) {
    console.log("token: ", typeof props.token);

    const navigate = useNavigate();
useEffect(() => {
 if(props.token.length === 0) {
     navigate(`/admin`)
 }
  }, []);

  return (
    <div>
        {props.token.length > 0 ? <div>Hello</div> : null}
    </div>
  )
  }
export default AdminUpload;