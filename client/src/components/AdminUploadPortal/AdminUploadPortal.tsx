import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import './AdminUploadPortal.scss';
import { useNavigate } from "react-router-dom";

interface AdminUploadPortalProps{
    token: string
}

const API_URL = process.env.REACT_APP_API;

function AdminUploadPortal(props: AdminUploadPortalProps) {
	const [selectedFile, setSelectedFile] = useState<null | File>(null);
	const navigate = useNavigate();
	const [fileUploadMsg, setFileUploadMsg] = useState("")
	const [dataUploadMsg, setDataUploadMsg] = useState("")
	const [firstFileUploadMsg, setFirstFileUploadMsg] = useState("")
	const [secondFileUploadMsg, setSecondFileUploadMsg] = useState("")
	
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()		
		setFileUploadMsg("Uploading file...")
		try {
			// TODO: CHECK FILE NAMES
			const formData = new FormData();
			formData.append("name", selectedFile!.name)
			formData.append("selectedFile", selectedFile!);
			const response = await fetch(`${API_URL}/updateData`, {
				method: "post",
				body: formData,
			});
			const result = await response.json();
			if (result.status) {
				if (selectedFile!.name === "NAWS_A2E191.csv"){
					setFirstFileUploadMsg(result.message + ": " + selectedFile!.name)
					setFileUploadMsg("")
				} else if (selectedFile!.name === "NAWS_F2Y191.csv") {
					setSecondFileUploadMsg(result.message + ": " + selectedFile!.name)
					setFileUploadMsg("")
				} else {
					setFileUploadMsg("Please name your file accordingly before uploading!")
				}
			} else {
				setFileUploadMsg(result.message)
			}
			
		} catch(error) {
			console.log(error);
		}
    }

	function handleFileSelect(event: any) {
		setSelectedFile(event.target.files[0])
	}

	async function handleUpdate(event: any) {
		event.preventDefault()
		setDataUploadMsg("Data processing ...")

		try {
			const response = await fetch(`${API_URL}/updateData`);
			setDataUploadMsg("The visualization data is updating. This might a while.")
			if (response.status === 200) {
				setDataUploadMsg("The visualization data is updated.")
			} else {
				setDataUploadMsg("There is an error in updating the data.")
			}
		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if(props.token.length === 0) {
			navigate(`/admin`)
		}
	}, []);

	return (
		<div className="upload">
			<p>Please upload "NAWS_A2E191.csv" and then "NAWS_F2Y191.csv"</p>
			<form onSubmit = {handleSubmit}>
				<input type="file" onChange={handleFileSelect} accept=".csv" />
				<input type="submit" value="Upload" />
			</form>
			<p>{fileUploadMsg}</p>
			<p>{firstFileUploadMsg}</p>
			<p>{secondFileUploadMsg}</p>
			<div className="preprocess">
				<p>Verify that both files were uploaded, then click the UPDATE DATA button below to preprocess the data</p>
				<Button onClick = {handleUpdate} variant="contained">Update Data</Button>
			</div>
			<p>{dataUploadMsg}</p>
		</div>
	);
}

export default AdminUploadPortal;