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
          <FaEye />
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
            <img className="rounded-full w-24 h-24 m-2 my-4" src="https://scontent.fmnl17-4.fna.fbcdn.net/v/t39.30808-6/342519116_239903575281737_2502511397981474913_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGei5JNqftMHCghkPoCdu2RPAPI3QCoQIY8A8jdAKhAhv7Yet5VIU_c4przNYblLs9FQ-ywj99Fxq84x13yCULT&_nc_ohc=tUrEzqnfPDEQ7kNvgHVG705&_nc_ht=scontent.fmnl17-4.fna&oh=00_AYCTA1KKOHd0U9WQQgRrBxf-m_AyJm7i3jEZbN0otevNWQ&oe=66BB7703" alt={user.name} />
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
