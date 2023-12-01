import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function CommentBoxModal(prop) {
	const [content, setContent] = useState(prop.content);

	function handleContentSave() {
		prop.retContent(content);
	}

	useEffect(() => {
		setContent(prop.content);
	}, [prop.content]);
	return (
		<Card
			sx={{
				"& .MuiTextField-root": {
					height: 150,
					width: 500,
				},
			}}
		>
			<CardContent>
				<div className="row">
					<p>Please enter your comments here.</p>
					<TextField
						fullWidth
						sx={{
							"& .MuiTextField-root": {
								height: "300px",
							},
						}}
						style={{ height: "300px !important" }}
						multiline
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</div>
				<div className="row">
					<div className="col-3 mt-2">
						<Button
							variant="contained"
							onClick={handleContentSave}
							className="secon-bg text-white"
						>
							Save
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
