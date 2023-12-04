const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
})


const scroller = document.querySelector('.scroller');
const scrollContainer = scroller.querySelector('.scroll-container')
const nextBtn = scroller.querySelector('.btn.next');
const prevBtn = scroller.querySelector('.btn.prev');
const itemWidth = scroller.querySelector('.scroll-item').clientWidth;

nextBtn.addEventListener('click', scrollToNextItem);
prevBtn.addEventListener('click', scrollToPrevItem);

function scrollToNextItem() {
    scrollContainer.scrollBy({left: itemWidth, top: 0, behavior: 'smooth'});
}
function scrollToPrevItem() {
    scrollContainer.scrollBy({left: -itemWidth, top: 0, behavior: 'smooth'});
}
// function scrollToNextItem() {
//     if(scrollContainer.scrollLeft < (scrollContainer.scrollWidth - itemWidth))
//         scrollContainer.scrollBy({left: itemWidth, top: 0, behavior:'smooth'});
//     else
//         scrollContainer.scrollTo({left: 0, top: 0, behavior:'smooth'});
// }
// function scrollToPrevItem() {
//     if(scrollContainer.scrollLeft != 0)
//         scrollContainer.scrollBy({left: -itemWidth, top: 0, behavior:'smooth'});
//     else
//         scrollContainer.scrollTo({left: scrollContainer.scrollWidth, top: 0, behavior:'smooth'});
// }

