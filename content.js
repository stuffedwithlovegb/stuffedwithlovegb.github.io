/* EDIT THIS FILE TO UPDATE PHOTOS AND PLUSH FRIENDS.
   Upload images beside index.html. Filenames and extensions are case-sensitive.
   Add/remove a complete {...} entry (including its comma). No HTML edits needed.
   Replacing an image with a file of the exact same name updates every use of it.
*/
window.FOW_CONTENT = {
  media: {
    hero: 'gallery-01.webp',
    machine: 'gallery-02.webp',
    stuffing: 'gallery-03.webp',
    events: 'gallery-04.webp',
    custom: 'gallery-05.webp'
  },
  /* Leave video filenames in place. Until the files exist, photos stay visible.
     When ready, upload fluff-spinning.mp4 and child-stuffing.mp4 beside index.html.
     For optional webm files change the type to 'video/webm'. */
  videos: {
    machine: {src: 'fluff-spinning.mp4', type: 'video/mp4'},
    stuffing: {src: 'child-stuffing.mp4', type: 'video/mp4'}
  },
  crew: [
    {name: 'Honey Teddy', image: 'shop-teddy.png', category: 'regular', alt: 'Honey Teddy plush friend'},
    {name: 'Golden Retriever', image: 'shop-dog.png', category: 'regular', alt: 'Golden Retriever plush friend'},
    {name: 'Unicorn', image: 'shop-unicorn.png', category: 'rotating', alt: 'Unicorn plush friend'},
    {name: 'Dino', image: 'shop-dino.png', category: 'rotating', alt: 'Dino plush friend'}
    // Example after uploading its photo (add a comma to the preceding entry):
    // ,{name: 'Orange Kitty', image: 'crew-kitty.webp', category: 'regular', alt: 'Orange Kitty plush'}
    // ,{name: 'Frog', image: 'crew-frog.webp', category: 'rotating', alt: 'Frog plush'}
    // ,{name: 'Black Cat', image: 'crew-black-cat.webp', category: 'seasonal', alt: 'Seasonal Black Cat plush'}
  ],
  gallery: [
    {image: 'gallery-01.webp', alt: 'Fluff On Wheels event setup'},
    {image: 'gallery-02.webp', alt: 'A closer look at the stuffing experience'},
    {image: 'gallery-03.webp', alt: 'Making a new plush friend'},
    {image: 'gallery-04.webp', alt: 'The plush party setup'},
    {image: 'gallery-05.webp', alt: 'Plush friends and event details'},
    {image: 'gallery-06.webp', alt: 'A Fluff On Wheels moment'},
    {image: 'gallery-07.webp', alt: 'Plush-making memories'},
    {image: 'gallery-08.webp', alt: 'Details from a Fluff On Wheels celebration'},
    {image: 'gallery-09.webp', alt: 'New friends at an event'},
    {image: 'gallery-10.webp', alt: 'Hands-on plush fun'},
    {image: 'gallery-11.webp', alt: 'A moment from the plush party'},
    {image: 'gallery-12.webp', alt: 'A little extra event magic'},
    {image: 'gallery-13.webp', alt: 'A friend to take home'},
    {image: 'gallery-14.webp', alt: 'A celebration with Fluff On Wheels'},
    {image: 'gallery-15.webp', alt: 'Fluff On Wheels in the community'},
    {image: 'gallery-16.webp', alt: 'Another happy plush-making moment'}
    // Example: ,{image: 'gallery-17.webp', alt: 'Describe your new photo here', caption: 'Optional caption under the photo'}
  ]
};
window.dispatchEvent(new Event('fow-content-ready'));
