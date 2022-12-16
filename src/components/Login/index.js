import "./login.css"
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

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

                // ...
            })
            .catch((error) => {

                const errorMessage = error.message;
                console.log(errorMessage)
            });
    }



    return (
        <div>
            <div className="main">
                <h1>Q-App</h1>
                <button onClick={signInWithFacebook}>Login With Facebook</button>
            </div>
        </div>
    );
}

export default Login;