//change the pictures for login and signup 
export function BackgroundSlider(images, interval = 3000) {
    if (!Array.isArray(images) || images.length === 0) 
        return;

    let index = 0;
    document.body.style.backgroundImage = `url('${images[index]}')`;

    setInterval(() => {
        index = (index + 1) % images.length;
        document.body.style.backgroundImage = `url('${images[index]}')`;
    }, interval);
}
