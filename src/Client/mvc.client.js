import axios from "axios";
import { getEndpoint } from "./endpoints";

export async function getContentForChannel(channelId){
    return await axios.get(getEndpoint("channelContent",channelId));
}

export async function getChannel(channelId){
    return await axios.get(getEndpoint("channelInfo",channelId));
}


