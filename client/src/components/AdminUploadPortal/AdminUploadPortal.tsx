import {useState} from "react";

import './AdminUploadPortal.scss';

const API_URL = process.env.REACT_APP_API;


function AdminUploadPortal() {

	const [selectedFile, setSelectedFile] = useState(null);
	//const fs = require('browserfs')
	
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		console.log("File Submitted")
		//console.log(selectedFile!)
		

		//fs.writeFile("data.csv", selectedFile!, (error: any) => {
		//	if (error){
		//		console.error('Error', error)
		//	} else {
		//		console.log('success')
		//	}
		//})
		

		const formData = new FormData();
		formData.append("selectedFile", selectedFile!);
		try {
			const response = await fetch(`${API_URL}/updateData`, {
				method: "post",
				body: formData,
				// headers: { "Content-Type": "multipart/form-data",
				// 'Access-Control-Allow-Origin': 'http://localhost:3000'},
			});
			const result = await response.json()
			console.log(result);
		} catch(error) {
			console.log(error);
		}
    }

	function handleFileSelect(event: any) {
		setSelectedFile(event.target.files[0])
	}

	return (
		<div className="upload">
			<form onSubmit = {handleSubmit}>
				<input type="file" onChange={handleFileSelect} accept=".csv" />
				<input type="submit" value="Upload" />
			</form>
			<form onSubmit = {handleSubmit}>
				<input type="file" onChange={handleFileSelect} accept=".csv" />
				<input type="submit" value="Upload" />
			</form>
		</div>
	);
}

export default AdminUploadPortal;