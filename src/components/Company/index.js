import { useEffect, useState } from "react";
import "./company.css"
import ModalForm from "./ModalForm"
import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Company() {
    const [openModal, setOpenModal] = useState(false)
    const [yourCompanies, setYourCompanies] = useState([])
    const [companyId, setCompanyId] = useState("")

const navigate = useNavigate()

useEffect(() => {
    if(companyId){
        localStorage.setItem('companyId', JSON.stringify(companyId))
        navigate('./companydetail')
    }
}, [companyId])

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const db = getFirestore();
        const auth = getAuth()
        const q = query(collection(db, "companies"), where("userId", "==", auth.currentUser.uid));

        const querySnapshot = await getDocs(q);
        const yourCompaniesList = []
        querySnapshot.forEach((doc) => {
            yourCompaniesList.push({ id: doc.id, ...doc.data() })
            console.log(yourCompaniesList)
        });
        setYourCompanies(yourCompaniesList)
    }


    return (
        <div className="main">
            <button onClick={() => { setOpenModal(true) }} className="home-btn">Add Your Company +</button>
            <div className="modal">{openModal && <ModalForm closeModal={setOpenModal} />}</div>
            <div className="your-comp-cont">
                <h3>Your Companies</h3>
                {
                    yourCompanies.map(({ name, id }) => {
                        return <span>Name: {name} <button onClick={()=>{setCompanyId(id)}}>View</button></span>
                    })
                }
            </div>
        </div>
    );
}

export default Company;