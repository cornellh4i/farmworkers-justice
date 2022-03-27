import {useState} from "react";
import axios from "axios";
import './AdminUploadPortal.scss';

function AdminUploadPortal() {
	const [selectedFile, setSelectedFile] = useState(null);
	
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		console.log("File Submitted")
		const formData = new FormData();
		formData.append("selectedFile", selectedFile!);
		try {
			const response = await axios({
				method: "post",
				url: "http://localhost:8080/api/updateData",
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			});
			console.log(response)
		} catch(error) {
			console.log(error)
		}
    }
    // TODO: Update type, possilbly React.ChangeEvent
	function handleFileSelect(event: any) {
		console.log("File Selected")
		console.log(event.target.files[0])
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