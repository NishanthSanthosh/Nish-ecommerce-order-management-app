import { useState } from "react";

const useModal = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item = null) => {
    setSelectedItem(item); // null for new item
    setOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setOpen(false);
  };

  return { open, selectedItem, openModal, closeModal };
};

export default useModal;
