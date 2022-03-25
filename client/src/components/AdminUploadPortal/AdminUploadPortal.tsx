import {useState} from "react";
import axios from "axios";
import './AdminUploadPortal.scss';

function AdminUploadPortal() {
	const [selectedFile, setSelectedFile] = useState(null);
	
    // Might be wrong on event type
	async function handleSubmit(event: React.SyntheticEvent) {
		event.preventDefault()
		console.log("Submitted")
		const formData = new FormData();
		if (selectedFile !== null) {
			formData.append("selectedFile", selectedFile);
		}
		try {
			const response = await axios({
				method: "post",
				url: "/api/updateData",
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			});
		} catch(error) {
			console.log(error)
		}
    }
    // TODO: Update type, possilbly React.ChangeEvent
	function handleFileSelect(event: any) {
		setSelectedFile(event.target.files[0])
	}

	return (
		<div className="sheet1">
			<form onSubmit = {handleSubmit}>
				<input type="file" onChange={handleFileSelect}/>
		  		<input type="submit" value="Upload File" />
			</form>
		</div>,
		<div className="sheet2">
			<form onSubmit = {handleSubmit}>
        		<input type="file" onChange={handleFileSelect}/>
          		<input type="submit" value="Send File" />
        	</form>
		</div>
        
	);
}

export default AdminUploadPortal;