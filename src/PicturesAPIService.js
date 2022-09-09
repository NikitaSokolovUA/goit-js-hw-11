import axios from "axios"
export default class PicturesAPIService {

    constructor() {
        this.searchQuery = ''
        this.page = 1
        this.totalHits = 0;
        this.hits = 0;
    }

    get query() {
        return this.searchQuery
    }
    
    set query(newItem) {
        this.searchQuery = newItem
    }



    async findSomePictures() {
        const BASE_URL = 'https://pixabay.com/api/'
        const API_KEY = '29773824-39fd0ee837bb8082420a788ac'
        const options = {
            params: {
                key: API_KEY,
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: '40',
                page: this.page,
            }
        }
    
        return await axios.get(`${BASE_URL}`, options)
            .then(({ data }) => {

                
                this.totalHits = data.totalHits;
                this.hits += data.hits.length
                this.compareHits = this.hits === this.totalHits
                return data.hits
            })
    }

    incrementPage() {
        this.page +=1
    }
    
    resetPage() {
        this.page = 1;
    }

    resetHits() {
        this.hits = 0;
    }

    booleanHits() {
        return this.compareHits
    }
}