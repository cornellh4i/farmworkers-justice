import {useState} from "react";
import { Button } from "@mui/material";

import './AdminUploadPortal.scss';

const API_URL = process.env.REACT_APP_API;


function AdminUploadPortal() {

	const [selectedFile, setSelectedFile] = useState<null | File>(null);
	
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()		
	
		try {
			const formData = new FormData();
			formData.append("name", selectedFile!.name)
			formData.append("selectedFile", selectedFile!);
			console.log("file name: ", selectedFile!.name)
			console.log("selectedFile: ", selectedFile)
			const response = await fetch(`${API_URL}/updateData`, {
				method: "post",
				body: formData,
			});
			const result = await response.json();
			console.log("response result: ", result);
		} catch(error) {
			console.log(error);
		}
    }

	function handleFileSelect(event: any) {
		setSelectedFile(event.target.files[0])
	}

	async function handleUpdate(event: any) {
		event.preventDefault()

		try {
			const response = await fetch(`${API_URL}/updateData`, );
			console.log(response);
		} catch(error) {
			console.log(error);
		}
	}

	return (
		<div className="upload">
			<p>Please upload "NAWS_A2E191.csv" and then "NAWS_F2Y191.csv"</p>
			<form onSubmit = {handleSubmit}>
				<input type="file" onChange={handleFileSelect} accept=".csv" />
				<input type="submit" value="Upload" />
			</form>
			{/* <div className="secondButton">
				<p>Please upload "NAWS_A2E191.csv"</p>
				<form onSubmit = {handleSubmit}>
					<input type="file" onChange={handleFileSelect} accept=".csv" />
					<input type="submit" value="Upload" />
				</form>
			</div> */}
			<div className="preprocess">
				<p>Verify that both files were uploaded to preprocess the data</p>
				<Button onClick = {handleUpdate} variant="contained">Update Data</Button>
			</div>
		</div>
	);
}

export default AdminUploadPortal;