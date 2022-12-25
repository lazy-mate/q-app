import "./login.css"
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

function Login() {

    const signInWithFacebook = () => {
        const provider = new FacebookAuthProvider();

        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {

                const user = result.user;
                console.log(user)

                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                // Add a new document in collection "cities"
                const db = getFirestore(); 
                setDoc(doc(db, "users", user.uid), {
                    name: user.displayName
                });

            })
            .catch((error) => {

                const errorMessage = error.message;
                console.log(errorMessage)
            });
    }



    return (
        <div>
            <div className="main">
                <button onClick={signInWithFacebook}>Login With Facebook</button>
            </div>
        </div>
    );
}

export default Login;