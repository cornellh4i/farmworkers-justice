import {useState} from "react";

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
			const result = await response.json()
			console.log("response result: ", result);
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