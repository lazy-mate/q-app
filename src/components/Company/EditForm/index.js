import './modalform.css'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from 'react';
import { getAuth } from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid"

function EditCompanyModal({ closeModal }) {
    const [companyName, setCompanyName] = useState("")
    const [since, setSince] = useState("")
    const [timings, setTimings] = useState("")
    const [uploadImage, setUploadImage] = useState(null)    
    let imageUrl = ''

    const addComapny = async (e) => {

        e.preventDefault();


        const storage = getStorage();
        const storageRef = ref(storage, `images/${uploadImage.name + v4()}`);
        if (uploadImage == null) return;

        // 'file' comes from the Blob or File API
        await uploadBytes(storageRef, uploadImage).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        imageUrl = await getDownloadURL(storageRef);
        console.log(imageUrl)

        const db = getFirestore();
        const auth = getAuth();

        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "companies"), {
            name: companyName,
            from: since,
            timing: timings,
            image: imageUrl,
            userId: auth.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);

        e.target.reset();
        closeModal(false)

    }


    return (
        <div>
            <div className='modal-bg'>
                <div className='modal-container'>
                    <div className='modal-title'>Add a Company</div>
                    <form onSubmit={addComapny}>
                        <div className='modal-body'>
                            <input onChange={(e) => { setCompanyName(e.target.value) }} placeholder='Company Name' />
                            <input onChange={(e) => { setSince(e.target.value) }} placeholder='Since ?' />
                            <input onChange={(e) => { setTimings(e.target.value) }} placeholder='Timings' />
                            Upload Images: (Max 3 images)<input type="file" onChange={(e) => { setUploadImage(e.target.files[0]) }} />
                        </div>
                        <div className='modal-footer'>
                            <button onClick={() => { closeModal(false) }}>Cancel</button>
                            <button type='submit'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditCompanyModal;