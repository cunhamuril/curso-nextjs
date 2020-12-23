import { client } from "@/lib/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import { Document } from "prismic-javascript/types/documents";
import PrismicDOM from "prismic-dom";

interface IProductProps {
  product: Document;
}

export default function Product({ product }: IProductProps) {
  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      <img src={product.data.thumbnail.url} width="300" alt="alt" />

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      />

      <p>Price: ${product.data.price}</p>
    </div>
  );
}

/**
 * Vai buscar os possíveis paths para colocar no lugar do slug
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true, // Vai fazer uma nova requisição sempre que for buscado um novo termo no slug
  };
};

/**
 * Vai buscar os dados pelo slug estaticamente
 */
export const getStaticProps: GetStaticProps<IProductProps> = async (
  context
) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 5,
  };
};
