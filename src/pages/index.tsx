import { GetServerSideProps } from "next";
import Link from "next/link";
import Prismic from "prismic-javascript";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";

import { Title } from "@/styles/pages/Home";
import SEO from "@/components/SEO";
import { client } from "@/lib/prismic";

interface IHomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: IHomeProps) {
  return (
    <div>
      <SEO title="DevCommerce, your best ecommerce" shouldExcludeTitleSuffix />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map((recommendedProduct) => (
            <li key={recommendedProduct.id}>
              <Link href={`catalog/products/${recommendedProduct.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/**
 * Utiliza-se assim quando as informações precisam ser indexadas
 */
export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
