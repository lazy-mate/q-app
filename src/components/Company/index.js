import { useState } from "react";
import "./company.css"
import ModalForm from "./ModalForm"

function Company() {
    const [openModal, setOpenModal] = useState(false)
    return (
        <div className="main">
            <h1>Q-App Company</h1>
            <button onClick={() => {setOpenModal(true)}} className="home-btn">+</button>
            <div className="modal">{openModal && <ModalForm closeModal={setOpenModal} />}</div>
        </div>
    );
}

export default Company;