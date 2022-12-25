import "./user.css"
import { getFirestore, runTransaction, onSnapshot, query, where, collection, addDoc, getDocs, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

function User() {

    const [companies, setCompanies] = useState([])
    const [companyDetails, setCompanyDetails] = useState([])

    const db = getFirestore();
    const getData = async () => {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const companiesList = []
        querySnapshot.forEach((doc) => {
            companiesList.push({ id: doc.id, ...doc.data() })
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
        });
    }

    const getToken = async () => {
        const db = getFirestore()


        // Create a reference to the SF doc.
        const compRef = doc(db, "companies", companyDetails[0].id);

        try {
            const newPopulation = await runTransaction(db, async (transaction) => {
                const comp = await transaction.get(compRef);

                const updatedToken = comp.data().currentToken + 1;
                const currentToken = comp.data().currentToken
                const todayToken = comp.data().todayToken
                if (todayToken > currentToken) {
                    transaction.update(compRef, { currentToken: updatedToken });

                    const auth = getAuth()

                    const docRef = await addDoc(collection(db, "users", auth.currentUser.uid, "tokens"), {
                        tokenNumber: updatedToken,
                        compName: comp.data().name
                    });

                } else {
                    return Promise.reject("Sorry! Population is too big");
                }
            });

            console.log("Population increased to ", newPopulation);
        } catch (e) {
            // This will be a "population is too big" error.
            console.error(e);
        }

        // if (compTodayToken > compCurrentToken) {
        //     const compRef = doc(db, "companies", companyDetails[0].id);
        //     await updateDoc(compRef, {
        //         currentToken: increment(1)
        //     });
        // } else {
        //     alert('Token Limit Full')
        // }


    }

    return (
        <div className="main">
            <h2>Select Company</h2>
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