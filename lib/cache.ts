import mcache from 'memory-cache';
import axios from 'axios';

export async function getCache(key: string){
    const cached = mcache.get(key);

    if(cached){
        return cached;
    }else{
        if(key == "getid"){
            const id = await getAllID();
            mcache.put(key, id);
            return id;
        }else{
            const rates = await getCurrent(key);
            mcache.put(key, rates);
            return rates;
        }
    }
}


async function getCurrent(target: string){
    const response = await axios.get(
        `https://api.apilayer.com/exchangerates_data/latest?symbols=${target}&base=IDR`,
        {
            headers: {
                apikey: `${process.env.API_KEY}`
            },
            responseType: 'text',
        }
    )

    return response.data.rates.target;
}

async function getAllID(){
    const response = await axios.get(
        `https://api.apilayer.com/exchangerates_data/symbols`,
        {
            headers: {
                apikey: `${process.env.API_KEY}`
            },
            responseType: 'text',
        }
    )

    return Object.keys(response.data.symbols);
}
