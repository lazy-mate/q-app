import "./user.css"
import { getFirestore, onSnapshot, query, where, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";

function User() {

    const [companies, setCompanies] = useState([])
    const [companyDetails, setCompanyDetails] = useState([])

    const db = getFirestore();
    const getData = async () => {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const companiesList = []
        querySnapshot.forEach((doc) => {
            companiesList.push({ ...doc.data() })
        });
        setCompanies(companiesList)
    }

    useEffect(() => {
        getData();
        console.log("Companies data === >", companies)
    }, [])


    const getRealTimeDetails = (e) => {
        console.log(e.target.value)
        const q = query(collection(db, "companies"), where("name", "==", e.target.value));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const companyDetailsList = [];
            querySnapshot.forEach((doc) => {
                companyDetailsList.push(doc.data());
            });
            setCompanyDetails(companyDetailsList)
            console.log("Company Details: ",companyDetails)
        });
    }

    return (
        <div className="main">
            <h1>Q-App User</h1>
            <select onChange={(e) => { getRealTimeDetails(e) }}>
                {companies.map(({ name }) => {
                    return <option value={name}>{name}</option>
                })}
            </select>
            <div className="details-container">
                <h4>Company Details</h4>
                {
                    companyDetails.map(({ name, from, timing }) => {
                        return( <div className="details">
                            <span>Name: {name}</span>
                            <span>Since: {from}</span>
                            <span>Timing: {timing}</span>
                            </div> )
                    })
                }

            </div>
            <button className="home-btn">Get Token</button>
        </div>
    );
}

export default User;