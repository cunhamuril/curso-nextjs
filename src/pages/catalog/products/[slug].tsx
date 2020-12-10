import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

/**
 * Lazy load de componente
 */
const AddToCartModal = dynamic(() => import("@/components/AddToCartModal"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Não vai ser renderizado pelo lado do servidor, sim pelo browser
});

export default function Search() {
  const router = useRouter();

  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  );
}
