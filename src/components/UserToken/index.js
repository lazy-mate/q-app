import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './usertoken.css'

function UserToken() {

    const [userTokens, setUserTokens] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const db = getFirestore();
        const auth = getAuth();
        const tokenList = []
        const querySnapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "tokens"));
        querySnapshot.forEach((doc) => {
            tokenList.push({ id: doc.id, ...doc.data() })
        });
        setUserTokens(tokenList)
        console.log(userTokens)

    }
    return (
        <div className='main'>
            {
                userTokens.map(({ tokenNumber, compName }) => {
                    return (
                    <div className='token-cont'>
                        <h3>Company Name: {compName}</h3>
                        <h5>Token Number: {tokenNumber}</h5>
                    </div>
                    )
                })
            }
        </div>
    );
}

export default UserToken;