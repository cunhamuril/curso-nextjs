import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

interface IProduct {
  id: string;
  title: string;
}

interface ICategoryProps {
  products: IProduct[];
}

export default function Category({ products }: ICategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>; // Loading caso esteja utilizando fallback
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Vai buscar os possíveis paths para colocar no lugar do slug
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("http://localhost:3333/categories");
  const categories = await response.json();

  const paths = categories.map((category) => {
    return {
      params: { slug: category.id },
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

  const response = await fetch(
    `http://localhost:3333/products?category_id=${slug}`
  );
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 60,
  };
};
