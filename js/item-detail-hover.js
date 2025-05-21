document.addEventListener('DOMContentLoaded', initItemDetailHover); 

//used in the item-detail page to show the full description when you hover over it
function initItemDetailHover() {
    const dataElements = document.querySelectorAll('.detail-value');

    dataElements.forEach(element => {
       
        const originalOverflow = element.style.overflow;
        const originalTextOverflow = element.style.textOverflow;
        const originalWebkitLineClamp = element.style.webkitLineClamp;
        const originalHeight = element.style.height;

        element.addEventListener('mouseenter', () => {
            element.style.overflow = 'visible';
            element.style.textOverflow = 'clip';
            element.style.webkitLineClamp = 'unset';
            element.style.height = 'auto'; 
        });

        element.addEventListener('mouseleave', () => {
            element.style.overflow = originalOverflow;
            element.style.textOverflow = originalTextOverflow;
            element.style.webkitLineClamp = originalWebkitLineClamp;
            element.style.height = originalHeight;
        });
    });
}

