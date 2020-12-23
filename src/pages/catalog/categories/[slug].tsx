import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Prismic from "prismic-javascript";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";

interface ICategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ category, products }: ICategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>; // Loading caso esteja utilizando fallback
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`catalog/products/${product.uid}`}>
              <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Vai buscar os possíveis paths para colocar no lugar do slug
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at("document.type", "category"),
  ]);

  const paths = categories.results.map((category) => {
    return {
      params: { slug: category.uid },
    };
  });

  return {
    paths,
    fallback: true, // Vai fazer uma nova requisição sempre que for buscado um novo termo no slug
  };
};

/**
 * Vai buscar os dados pelo slug estaticamente
 */
export const getStaticProps: GetStaticProps<ICategoryProps> = async (
  context
) => {
  const { slug } = context.params;

  const category = await client().getByUID("category", String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  };
};
