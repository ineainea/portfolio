'use strict';


const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    // console.log(window.scrollY);
    // console.log('navbarHeight => ' +  navbarHeight); //104
    if(window.scrollY > navbarHeight){
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
})

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
    
    const target = event.target;
    const link = target.dataset.link;
    if(link == null){
        return;
    }
    navbarMenu.classList.remove('open');
    scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
    navbarMenu.classList.toggle('open');
});

// Home에 있는 "Contact Me" 버튼 누를 시 컨택 페이지로 스크롤 이동
const homeContact = document.querySelector('.home__contact');
homeContact.addEventListener('click', () => {
    scrollIntoView('#contact')
});

// 스크롤을 내릴수록 #Home의 이미지 및 텍스트가 투명하게 변함
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    // console.log('home__hieght => ' + homeHeight); //712
    // console.log(1 - window.scrollY / homeHeight);
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

//스크롤 내리면 "Arrow-up" 버튼이 나타남
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if(window.scrollY > homeHeight / 2){
        arrowUp.classList.add('visible')
    } else {
        arrowUp.classList.remove('visible');
    }
});

//"Arrow-up" 버튼을 클릭하면 최상단으로 스크롤 이동
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
});

//프로젝트 메뉴
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
// project들을 배열로 모두 가져와야하기 때문에 querySelctorAll를 써야함
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if(filter == null) {
        return;
    }
    //My work에서 메뉴 버튼을 선택 시 이전 메뉴에 있던 active를 없애고 선택한 메뉴 버튼에 active 시킴
    const active = document.querySelector('.category__btn.selected');
    active.classList.remove('selected');
    // "button" 태그가 아닌 "span" 태그를 터치할 경우, span 태그에 "selected"가 활성화되서 css가 실행되지 않음
    // 그래서 "? true값 : fale값 " 문법을 사용해서 span태그를 선택하더라고 button 태그로 이동하게끔 설정함
    const target = e.target.nodeNam === 'BUTTON' ? e.target : e.target.parentNode;
    target.classList.add('selected');


    // 메뉴를 누르면 해당 project 들이 사라지고
    projectContainer.classList.add('anim-out');
    setTimeout(() => {
        // 나타나는 효과가 0.3초 뒤에 실행됨 
        projects.forEach((project) => {
            console.log(project.dataset.type);
            if(filter == '*' || filter == project.dataset.type){
                project.classList.remove('invisible');
            } else {
                project.classList.add('invisible');
            }
        });
        projectContainer.classList.remove('anim-out');
    }, 300);

});

// 1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다.
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화시킨다.

const sectionIds = [
    '#home',
    '#about',
    '#skills',
    '#work',
    '#testimonials',
    '#contact'
];

// id값들을 배열로 나열하고 section, navItems 변수에 선언.... key : value 형식인가...? Array 강의 들어야함
const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];

//selected로 인자가 들어오면
//현재 세션의 "active" 클래스를 삭제하고,
//해당 인자에 해당하는 세션에 "active" 클래스를 추가하는 함수
function selectNavItem(selected) {
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}

// 해당 위치로 스크롤이 자동 이동되는 함수
function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior: "smooth"});
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

// 옵져버 옵션(화면) 설정
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
}
// 옵져버 함수 설정
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        // Array 배열을 forEach문으로 전부 하나씩 다 돌리는데
        // 만약 현재 화면에 요소가 빠져나가면
        // 그 요소의 배열 순번을 변수로 설정함
        if(!entry.Intersecting && entry.intersectionRatio > 0){
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            console.log('index, entry.target.id => ' + index, entry.target.id);
            // entry.getBoundingClientRect.y 의 값이 마이너스라는 뜻은
            // 스크롤링이 아래로 되어서 페이지가 화면 밖 위로 올라옴
            // 세션이 화면 밖으로 나갈때 아래 수식을 이용해서 다음에 나올 index의 값을 지정함.
            if(entry.boundingClientRect.y < 0){
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
        }
    })
}
// 최종 옵져버 설정
const observer = new IntersectionObserver(observerCallback, observerOptions);
// 섹션들을 돌면서 옵져버가 관찰하게 함
sections.forEach(section => observer.observe(section));

//스크롤링이 될 때마다 해당하는 메뉴를 선택
// scroll은 자동적으로 스크롤링 자체에서 발생하는 이벤트
// wheel은 사용자가 직접 조작하는 스크롤링
window.addEventListener('wheel', () => {
    //스크롤해서 페이지가 제일 위에 있을 경우
    if(window.scrollY === 0){
        selectedNavIndex = 0;
    //스크롤해서 페이지가 제일 아래로 내렸을 경우
    } else if(Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight){ 
        selectedNavIndex = navItems.length - 1;
    }
    // 스크롤 위치가 위 2개의 조건식에 부합하지 않는다면
    selectNavItem(navItems[selectedNavIndex]);
});