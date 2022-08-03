import { getCache } from "./cache";


export async function convertCurrency(amount: number, source: string) : Promise<number>{
    const rates = await getCache(source)
    console.log(rates);
    return amount * rates;
}