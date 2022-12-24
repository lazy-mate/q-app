import "./user.css"
import { getFirestore, onSnapshot, query, where, collection, getDocs, increment, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

function User() {

    const [companies, setCompanies] = useState([])
    const [companyDetails, setCompanyDetails] = useState([])
    const [compCurrentToken, setCompCurrentToken] = useState(0)
    const [compTodayToken, setCompTodayToken] = useState(0)

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
    }, [])


    const getRealTimeDetails = (e) => {
        const q = query(collection(db, "companies"), where("name", "==", e.target.value));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const companyDetailsList = [];
            querySnapshot.forEach((doc) => {
                companyDetailsList.push({ id: doc.id, ...doc.data() });
            });
            setCompanyDetails(companyDetailsList)
            setCompTodayToken(companyDetailsList[0].todayToken)
            setCompCurrentToken(companyDetailsList[0].currentToken)
        });
    }

    const getToken = async () => {

        if (compCurrentToken < compTodayToken) {
            const compRef = doc(db, "companies", companyDetails[0].id);
            await updateDoc(compRef, {
                currentToken: increment(1)
            });
        } else {
            alert('Token Limit Full')
        }


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
                    companyDetails.map(({ name, from, timing, todayToken, currentToken, estimatedTime }) => {
                        return (<div className="details">
                            <span>Name: {name}</span>
                            <span>Since: {from}</span>
                            <span>Timing: {timing}</span>
                            <span>Today's Token: {todayToken}</span>
                            <span>Current Token: {currentToken}</span>
                            <span>Estimated Time: {estimatedTime}</span>
                        </div>)
                    })
                }

            </div>
            <button className="home-btn" onClick={() => { getToken() }}>Get Token</button>
        </div>
    );
}

export default User;