import {useState} from "react";
import axios from "axios";
import './AdminUploadPortal.scss';

const API_URL = process.env.REACT_APP_API;

function AdminUploadPortal() {
	const [selectedFile, setSelectedFile] = useState(null);
	
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		console.log("File Submitted")
		console.log(selectedFile!)
		const formData = new FormData();
		formData.append("selectedFile", selectedFile!);
		try {
			const response = await axios({
				method: "post",
				url: `${API_URL}/updateData`,
				data: formData.get("selectedFile"),
				// headers: { "Content-Type": "multipart/form-data",
				// 'Access-Control-Allow-Origin': 'http://localhost:3000'},
			});
			console.log(response.status)
		} catch(error) {
			console.log(error)
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