import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import FormData from 'form-data';

function App() {
  const [results, setResults] = useState([]);

  const inputRef = useRef(null);
  const handleClick =  () => {

    inputRef.current.click();
  };

  
  const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];
    if(!fileObj) {
      return;
    }
    console.log('fileObj is', fileObj);

    document.getElementById('output_image').style.display='block';
    const reader = new FileReader();
    reader.onload = (evt) => {
      var output = document.getElementById('output_image');
      output.src = reader.result;
      console.log(evt.target.result);

      return event.target.result;
    };
    const fileData = reader.readAsArrayBuffer(event.target.files[0]);

     (async () => {
      const form = new FormData();
      form.append('file', fileData );

      try {
        const response = await axios.post('http://localhost:5000/api/predict', form, {
          headers: {
             'Content-Type': 'multipart/form-data' 
          }
        });
    
        if (response.status === 200) {
          // File successfully uploaded
          // You can handle the response from the API here
          console.log('file uploaded:', form.file);
        } else {
          // Handle API error
          console.log('file upload didnt work');
        }
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    })()


    event.target.value = null;
  }

  return (
    <div className="App">
      <h1>Custom Vision App</h1>
      <h2>Image Classification Results</h2>
      <div>
          <input 
            style={{display: 'none'}}
            ref={inputRef}
            type={"file"}
            onChange={handleFileChange}
          />

          <button onClick={handleClick}>Upload a Car Pic</button>
          <img id="output_image"/>
          <ul id="Result">

          </ul>
      </div>
    </div>
    
  );
}

export default App;
