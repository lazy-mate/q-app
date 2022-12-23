import './companydetail.css'
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState, useEffect } from 'react';

function CompanyDetail({ closeModal }) {

    const [token, setToken] = useState(0)
    const [estimatedTime, setEstimatedTime] = useState(null)
    const [companyInfo, setCompanyInfo] = useState([])

    useEffect(() => {
        getCompanyData();
    }, []);

    const getCompanyData = async () => {
        const db = getFirestore()

        const comapnyId = JSON.parse(localStorage.getItem('companyId'))
        console.log(comapnyId)

        const docRef = doc(db, "companies", comapnyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setCompanyInfo(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }




    return (
        <div>
            <div className='main'>
                <div className='comp-detail-cont'>
                    <h1>{companyInfo.name}</h1>
                    <div className='modal-cont'>
                        <form>
                            <div className='modal-body'>
                                <input onChange={(e) => { setToken(e.target.value) }} placeholder="Today's Token" />
                                <input onChange={(e) => { setEstimatedTime(e.target.value) }} placeholder='Estimated Time for each Token' />
                            </div>
                            <div className='modal-footer'>
                                <button onClick={() => { closeModal(false) }}>Cancel</button>
                                <button type='submit'>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyDetail;