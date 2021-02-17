import axios from "axios";

export default class BeatstoreService {
    baseUrl = 'http://localhost:5000/api/beats';
    // getBeats = () => {
    //     return [{
    //         "id": 1,
    //         "audioUrl": "/beats/Vacation Cm 135bpm.mp3",
    //         "imgUrl": "/covers/Sharp G_sharp_m_190bpm.png",
    //         "bpm": 135,
    //         "isFree": 0,
    //         "time": "03:35",
    //         "name": "Vacation",
    //         "scale": "Cm",
    //         "tags": ["JackHill", "JoshA", "Guitar", "Chill", "Soul", "biba", "boba", "eiqweqwe", "qweqweqwe", "qweqwe", "qweqweqwe", "qweqweqweqwe", "qweqwe"]
    //     }, {
    //         "id": 2,
    //         "audioUrl": "/beats/Raindrop Gm 139.mp3",
    //         "imgUrl": "/covers/Sharp G_sharp_m_190bpm.png",
    //         "bpm": 139,
    //         "isFree": 0,
    //         "time": "04:05",
    //         "name": "Raindrop",
    //         "scale": "Gm",
    //         "tags": ["Logic", "Eminem", "Quadeca", "Hard", "BrokenDrill"]
    //     }, {
    //         "id": 3,
    //         "audioUrl": "/beats/Sharp G_sharp_m_190bpm.mp3",
    //         "imgUrl": "/covers/Sharp G_sharp_m_190bpm.png",
    //         "bpm": 190,
    //         "isFree": 1,
    //         "time": "02:27",
    //         "name": "Sharp",
    //         "scale": "G#m",
    //         "tags": ["Tyga", "Tory Lanez", "Club", "Hard"]
    //     }];
    // };
    //
    getBeats = async (skip, limit = 10, filter = {}) => {
        return axios.get(this.baseUrl, {
            params: {
                skip,
                limit,
                filter
            },
        });
    };
    getInfo = async () => {
        return axios.get(this.baseUrl + '/info');
    };

    getBeatById = async (id) => {
        console.log(this.baseUrl + `/${id}`);
        return axios.get(this.baseUrl + `/${id}`);
    }
};