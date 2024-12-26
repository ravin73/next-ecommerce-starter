import { WixClientServer } from "@/lib/WixClientServer";
import { products } from "@wix/stores";
import Image from "next/image"
import Link from "next/link"
import DOMPurify from "isomorphic-dompurify";
const PRODUCT_PER_PAGE = 20;
const ProductList = async ({
    categoryId, limit,searchParams
}: {
    categoryId: string,
    limit?: number
    searchParams?:any
}) => {

    const wixClient = await WixClientServer();
    
    const productquery = await wixClient.products
        .queryProducts()
        .startsWith("name",searchParams?.name || "")
        .hasSome("productType",[searchParams?.type || "physical","digital"])
        .gt("priceData.price",searchParams?.min || 0)
        .lt("priceData.price",searchParams?.max || 999999)
        .eq("collectionIds", categoryId)
        .limit(limit || PRODUCT_PER_PAGE)
        // .find();    
        if(searchParams?.sort){
            const [sortType,sortBy]=searchParams.sort.split("")
            
            if(sortType==="asc"){
                productquery.ascending(sortBy)
            }
        }
    
    return (
        <div className="flex gap-x-8 gap-y-16 flex-wrap mt-12">
            {res.items.map((product: products.Product) => (


                <Link href={"/" + product.slug} className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]" key={product._id}>
                    <div className="relative w-full h-80">
                        <Image
                            src={product.media?.mainMedia?.image?.url || "/product.png"}
                            alt=""
                            fill sizes="25vw"
                            className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-300"
                        />
                        {product.media?.items &&( <Image
                            src={product.media?.items[1]?.image?.url || "/product.png"}
                            alt=""
                            fill sizes="25vw"
                            className="absolute object-cover rounded-md"
                        />)}
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span className="font-semibold">${product.price?.price}</span>
                    </div>
                    {product.additionalInfoSections && (
                        <div className="text-sm text-gray-500"  dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              product.additionalInfoSections.find(
                                (section: any) => section.title === "shortDesc"
                              )?.description || ""
                            ),
                          }}>
                        </div>
                    )}
                    <button className="w-max rounded-2xl ring-1 ring-lama text-lama py-2 px-4 text-xs hover:bg-lama hover:text-white">Add to Cart</button>
                </Link>
            ))}
        </div>
    )
}
export default ProductList