import { useState } from 'react';
import { BsFillCloudArrowUpFill } from 'react-icons/bs';
import './App.css';

function App() {
  const notiText = 'Upload QR Code to Scan'
  const [textToCopy, setTextToCopy] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [notify, setNotify] = useState(notiText);

  function copy() {
    // Get the text field
    var copyText = document.getElementById("myInput");

    // Select the text field
    copyText.select();
    // copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    alert("Copied the text: " + copyText.value);
  }

  function clickToViewFile() {
    document.querySelector('input').click();
  }


  async function onChangeFile(e) {
    let subVar;
    let file = e.target.files[0];
    if (file.size > 90000) {
      setNotify(`Couldn't scan QR code`);
      return;
    }
    let formData = new FormData();//new FormData
    formData.append('file', file);//add file to formData
    await fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST', body: formData
    }).then((res) => res.json())
      .then((result) => {
        subVar = result[0].symbol[0].data;
        if (subVar === null) {
          setNotify(`Couldn't scan QR code`);
          // document.querySelector('p').removeAttribute('hidden');
        }
        else {
          setTextToCopy(subVar);
          setSelectedImage(file);
        }
      })
  }

  function close() {
    setNotify(notiText);
    setSelectedImage();
    setTextToCopy();
  }

  return (
    <div className="readQRApp">
      <form action="#" onClick={clickToViewFile}>
        <input type="file" hidden onChange={onChangeFile} />
        {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="not found" />}

        <div>
          <BsFillCloudArrowUpFill className='icon' />
          <p>{notify}</p>
        </div>
      </form>

      <div className="detail">
        {/* <textarea>{textToCopy}</textarea> */}
        <h1>{textToCopy}</h1>
        <div className='btn'>
          {selectedImage || notify === `Couldn't scan QR code` ? <div>
            <button className='copy' onClick={() => { navigator.clipboard.writeText(textToCopy) }}>Copy</button>
            <button className='close' onClick={close}>Close</button>
          </div>
            :
            <div>
              <button className='copy' onClick={() => { navigator.clipboard.writeText(textToCopy) }} hidden>Copy</button>
              <button className='close' hidden>Close</button>
            </div>
          }

        </div>
      </div>

    </div >
  );
}

export default App;
