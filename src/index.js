import picturesTpl from './template/images.hbs'
import PicturesAPIService from "./PicturesAPIService.js"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

const picturesAPIService = new PicturesAPIService();
const InfiniteObserve = new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) {
        observer.unobserve(entry.target)
        makeFetchAndTamplate()
    }
}, )


refs.searchForm.addEventListener('submit', onSubmitFetchPictures)

let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionType: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
});


function onSubmitFetchPictures(e) {
    e.preventDefault()
    
    picturesAPIService.query = e.currentTarget.elements.searchQuery.value

    if (picturesAPIService.query.length === 0) {
        Notify.warning('Input to find some pictures')
        return
    } 

    picturesAPIService.resetPage()
    picturesAPIService.resetHits()

    resetTamplatesPictures()
    makeFetchAndTamplate()
}

async function makeFetchAndTamplate() {
    try {
            await picturesAPIService.findSomePictures().then((pictures) => {
            const isFirstPage = picturesAPIService.page === 1;

            if (pictures.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.')
                return
            }

            if (isFirstPage) {
                Notify.success(`Hooray! We found ${picturesAPIService.totalHits} images.`)
                } 
                
            if (picturesAPIService.booleanHits()) {
                Notify.info(`We're sorry, but you've reached the end of search results.`)
                }

            renderTamplateOfPic(pictures) 
            if (!isFirstPage) {
                addSmothScroll()
            }
                    
        })


        picturesAPIService.incrementPage()
        gallery.refresh()
        
        if (!picturesAPIService.booleanHits()) {
            const lastCard = document.querySelector('.photo-card:last-child')

            if (lastCard) {
                    InfiniteObserve.observe(lastCard)
            }
        }
        
        
        
        
    } catch (error) {
        console.error(error);
        
        
    }
}


function renderTamplateOfPic(pictures) {
    refs.gallery.insertAdjacentHTML('beforeend', picturesTpl(pictures))
}

function resetTamplatesPictures() {
     refs.gallery.innerHTML = ''
}


function addSmothScroll() {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();


window.scrollBy({
  top: cardHeight ,
  behavior: "smooth",
});
}



