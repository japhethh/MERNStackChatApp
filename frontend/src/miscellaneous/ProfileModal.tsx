import React, { useRef } from 'react';
import { FaEye } from 'react-icons/fa';

interface ProfileModalProps {
  children: React.ReactNode;
  user: any;
}

const ProfileModal = ({ children, user }: ProfileModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  return (
    <>
      {children ? (
        <span onClick={openModal}>{children}</span>
      ) : (
        <button className="btn btn-ghost" onClick={openModal}>
          <FaEye className="text-xl" />
        </button>
      )}
      <dialog
        id="my_modal_1"
        className="modal"
        ref={modalRef}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="modal-box ">
          <div className='flex flex-col justify-between items-center'>
            <h1 className="font-bold text-2xl text-center ">{user.name}</h1>
            <img className="rounded-full w-24 h-24 m-2 my-4" src={user.pic ? user.pic : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"} alt={user.name} />
            <p className="py-4 text-xl">{user.email}</p>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ProfileModal;
