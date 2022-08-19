const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

async function getProducts(search, sort) {

    try {

        var query = `query: "title:*${search}*"`;
        if (search == undefined || search == "") { query = "" }

        const res = await fetch(`https://${process.env.STORE}.myshopify.com/admin/api/2022-07/graphql.json`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Shopify-Access-Token': process.env.TOKEN,
                // 'X-GraphQL-Cost-Include-Fields': true
            },
            body: JSON.stringify({
                query: `
                query($cursor:String){
                    products(first: 25 ${query} after: $cursor reverse: ${sort}) {
                        edges {
                            cursor
                            node {
                                id
                                title
                                status
                                vendor
                                descriptionHtml
                                productType
                                variants(first: 1) {
                                    nodes {
                                        price
                                        inventoryQuantity
                                    }  
                                }
                            }
                        }
                        
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                    }
                }    
                `,
            }),
        })

        const data = await res.json();

        const products = data.data.products.edges;
        const pageInfo = data.data.products.pageInfo;

        return [products, pageInfo];

    } catch (error) {
        return error.message;
    }
}

async function getAfterProducts(search, sort, page) {

    try {
        if (page == undefined) { page = "eyJsYXN0X2lkIjo3NjU0NTE0MzI3NzI2LCJsYXN0X3ZhbHVlIjoiNzY1NDUxNDMyNzcyNiJ9" }

        var query = `query: "title:*${search}*"`;
        if (search == undefined || search == "") { query = "" }

        const res = await fetch(`https://${process.env.STORE}.myshopify.com/admin/api/2022-07/graphql.json`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Shopify-Access-Token': process.env.TOKEN,
                // 'X-GraphQL-Cost-Include-Fields': true
            },
            body: JSON.stringify({
                query: `
                query{
                    products(first: 25 ${query} after: "${page}" reverse: ${sort}) {
                        edges {
                            cursor
                            node {
                                id
                                title
                                status
                                vendor
                                descriptionHtml
                                productType
                                variants(first: 1) {
                                    nodes {
                                        price
                                        inventoryQuantity
                                    }  
                                }
                            }
                        }
                        
                        pageInfo {
                            hasPreviousPage
                            startCursor
                            hasNextPage
                            endCursor
                        }
                    }
                }    
                `,
            }),
        })

        const data = await res.json();

        const products = data.data.products.edges;
        const pageInfo = data.data.products.pageInfo;

        return [products, pageInfo];

    } catch (error) {
        return error.message;
    }
}

async function getBeforeProducts(search, sort, page) {

    try {
        if (page == undefined) { page = "eyJsYXN0X2lkIjo3NjU0NTE1NTQwMTQyLCJsYXN0X3ZhbHVlIjoiNzY1NDUxNTU0MDE0MiJ9" }

        var query = `query: "title:*${search}*"`;
        if (search == undefined || search == "") { query = "" }

        const res = await fetch(`https://${process.env.STORE}.myshopify.com/admin/api/2022-07/graphql.json`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Shopify-Access-Token': process.env.TOKEN,
                // 'X-GraphQL-Cost-Include-Fields': true
            },
            body: JSON.stringify({
                query: `
                query{
                    products(last: 25 ${query} before: "${page}" reverse: ${sort}) {
                        edges {
                            node {
                                id
                                title
                                status
                                vendor
                                descriptionHtml
                                productType
                                variants(first: 1) {
                                    nodes {
                                        price
                                        inventoryQuantity
                                    }  
                                }
                            }
                        }
                        pageInfo {
                            hasPreviousPage
                            startCursor
                            hasNextPage
                            endCursor
                        }
                    }
                }    
                `,
            }),
        })

        const data = await res.json();

        const products = data.data.products.edges;
        const pageInfo = data.data.products.pageInfo;

        return [products, pageInfo];
        //return data;

    } catch (error) {
        return error.message
    }
}

async function createProduct(requestBody) {

    const title = requestBody.title;
    const productType = requestBody.productType;
    const vendor = requestBody.vendor;
    const fullDescription = requestBody.fullDescription;
    var tags = requestBody.tags;
    var price = requestBody.price;
    var cost = requestBody.cost;

    if (cost == undefined || cost == "") { cost = price }
    if (tags == undefined || tags == "") { tags = '' }

    try {

        // Set Product
        const product = await fetch(`https://${process.env.STORE}.myshopify.com/admin/api/2022-07/graphql.json`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Shopify-Access-Token': process.env.TOKEN,
                // 'X-GraphQL-Cost-Include-Fields': true
            },
            body: JSON.stringify({
                query: `
                mutation {
                    productCreate(
                        input: {
                            title: "${title}",
                            productType: "${productType}",
                            vendor: "${vendor}",
                            descriptionHtml: "${fullDescription}",
                            tags: "${tags}",
                            variants: [
                                {                                          
                                    price: "${price}",
                                    inventoryItem: {
                                        cost: "${cost}",
                                        tracked: true,
                                    },
                                }
                            ],
                            metafields: [
                                {
                                    key: "new",
                                    value: "newvalue",
                                    type: "string",
                                    namespace: "global"
                                }
                            ]
                        }
                    ) 
                    {
                        product {
                            id
                        }
                    }
                } 
                `,
            }),
        })

        const productData = await product.json();

        if (productData.errors == undefined) {
            return "success";
        } else {
            return "error";
        }

    } catch (error) {
        return "error";
    }

}

module.exports = { getProducts, getBeforeProducts, getAfterProducts, createProduct }