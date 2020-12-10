import { GetServerSideProps } from "next";

import { Title } from "@/styles/pages/Home";

interface IProduct {
  id: string;
  title: string;
}

interface IHomeProps {
  recommendedProducts: IProduct[];
}

// TTFB - Time to first byte

export default function Home({ recommendedProducts }: IHomeProps) {
  async function handleSum() {
    /**
     * Importação dinâmica: só carrega quando for solicitado o uso
     */
    const math = (await import("@/lib/math")).default;

    alert(math.sum(3, 5));

    /**
     * Quando é colocado NEXT_PUBLIC_ antes do nome da variável, a variável vai aparecer no browser,
     * caso contrário não, dai só funcionaria para o node podendo utilizar nas funções do tipo "getServerSideProps"
     */
    console.log(process.env.NEXT_PUBLIC_API_URL);
  }

  return (
    <div>
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map((recommendedProduct) => (
            <li key={recommendedProduct.id}>{recommendedProduct.title}</li>
          ))}
        </ul>
      </section>

      <button onClick={handleSum}>Sum!</button>
    </div>
  );
}

/**
 * Utiliza-se assim quando as informações precisam ser indexadas
 */
export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/recommended`
  );
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts,
    },
  };
};
