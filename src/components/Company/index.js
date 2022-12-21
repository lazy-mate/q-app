import { useEffect, useState } from "react";
import "./company.css"
import ModalForm from "./ModalForm"
import EditCompanyModal from "./EditForm"
import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Company() {
    const [openModal, setOpenModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [yourCompanies, setYourCompanies] = useState([])


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

    const editCompany = async (id) => {
        
        const db = getFirestore();

        const company = doc(db, "companies", id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(company, {
            token: 10
        });
        console.log(company)
    }

    return (
        <div className="main">
            <h1>Q-App Company</h1>
            <button onClick={() => { setOpenModal(true) }} className="home-btn">+</button>
            <div className="modal">{openModal && <ModalForm closeModal={setOpenModal} />}</div>
            <div className="your-comp-cont">
                <h3>Your Companies</h3>
                {
                    yourCompanies.map(({ name }) => {
                        return <span>Name: {name} <button onClick={() => {setEditModal(true) }}>Edit</button></span>
                    })
                }
            <div className="modal">{editModal && <EditCompanyModal closeModal={setEditModal} />}</div>
            </div>
        </div>
    );
}

export default Company;