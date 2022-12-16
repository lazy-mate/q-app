import "./user.css"
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

function User() {

    const [companies, setCompanies] = useState([])

    const db = getFirestore();
    const getData = async () => {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const companiesList = []
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "====>", doc.data())
            companiesList.push({...doc.data()})
        });
        setCompanies(companiesList)
    }

    useEffect(() => {
        getData();
        console.log("Companies data === >",companies)
    }, [])





    return (
        <div className="main">
            <h1>Q-App User</h1>
            <select>
                {companies.map(({name})=> {
                    return <option>{name}</option>
                })}
            </select>
            <div className="details-container">

            </div>
            <button className="home-btn">Get Token</button>
        </div>
    );
}

export default User;