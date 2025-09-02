import {useState} from "react";
import "./Submission.css";

function Submission(){
    const [caption , setCaption] = useState("");
    const [file,setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!file) {
            alert("Please select a photo before submitting : ");
            return;
        }

        // This is where Backend API call will go later
        console.log("Submitting : ",{caption,file});
        alert("Your photo has been submitted successfully !");

        setCaption("");
        setFile(null);
    };

    return(
        <div className="submission-container">
            <h1>Submit Your Photo</h1>
            <p>Uplaod your entry for this challenge and stand a chance to win!</p>

            <form className="submission-form" onSubmit={handleSubmit}>
                <label>Photo Upload</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e)=> setFile(e.target.files[0])}
                />

                <label>Caption (optional)</label>
                <input
                    type="text"
                    placeholder="Add a Caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />

                <button type="submit" className="submit-btn">
                    Submit Entry
                </button>
            </form>
        </div>
    );
}

export default Submission;