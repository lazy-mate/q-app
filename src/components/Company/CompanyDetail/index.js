import './companydetail.css'
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CompanyDetail({ closeModal }) {

    const [token, setToken] = useState(0)
    const [currentToken, setCurrentToken] = useState(0)
    const [estimatedTime, setEstimatedTime] = useState(0)
    const [companyInfo, setCompanyInfo] = useState([])

    const comapnyId = JSON.parse(localStorage.getItem('companyId'))

    const navigate = useNavigate()

    useEffect(() => {
        getCompanyData();
    }, []);

    const getCompanyData = async () => {
        const db = getFirestore()

        const docRef = doc(db, "companies", comapnyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setCompanyInfo(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }
    const updateToken = async (e) => {
        e.preventDefault();
        const db = getFirestore()

        const company = doc(db, "companies", comapnyId);

        // Set the "capital" field of the city 'DC'
        await updateDoc(company, {
            todayToken: token,
            currentToken: currentToken,
            estimatedTime: estimatedTime
        });
        e.target.reset()
        navigate('/company', { replace: true });

    }




    return (
        <div>
            <div className='main'>
                <div className='comp-detail-cont'>
                    <h1>{companyInfo.name}</h1>
                    <div className='modal-cont'>
                        <form onSubmit={updateToken}>
                            <div className='modal-body'>
                                <input onChange={(e) => { setToken(e.target.value) }} placeholder="Today's Token" />
                                <input onChange={(e) => { setCurrentToken(e.target.value) }} placeholder="Current Token" />
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