/* EDIT THIS FILE TO UPDATE PHOTOS AND PLUSH FRIENDS.
   Upload images beside index.html. Filenames and extensions are case-sensitive.
   Add/remove a complete {...} entry (including its comma). No HTML edits needed.
   Replacing an image with a file of the exact same name updates every use of it.
*/
window.FOW_CONTENT = {
  media: {
    hero: 'setup1.webp',
    machine: 'gallery-02.webp',
    stuffing: 'gallery-02.webp',
    events: 'gallery-04.webp',
    custom: 'gallery-05.webp'
  },

  /* Upload machinespin.mp4 beside index.html for the machine video.
     child-stuffing.mp4 is optional; until uploaded, its photo stays visible.
     For optional webm files change the type to 'video/webm'. */
  videos: {
    machine: {src: 'machinespin.mp4', type: 'video/mp4'},
    stuffing: {src: 'child-stuffing.mp4', type: 'video/mp4'}
  },

  crew: [
    {name: 'Honey Teddy', image: 'shop-teddy.png', category: 'regular', alt: 'Honey Teddy plush friend'},
    {name: 'Golden Retriever', image: 'shop-dog.png', category: 'regular', alt: 'Golden Retriever plush friend'},
    {name: 'Orange Kitty', image: 'orangecat.webp', category: 'regular', alt: 'Orange Kitty plush friend'},
    {name: 'Unicorn', image: 'shop-unicorn.png', category: 'rotating', alt: 'Unicorn plush friend'},
    {name: 'Dino', image: 'shop-dino.png', category: 'rotating', alt: 'Dino plush friend'},
    {name: 'Dino', image: 'dino2.webp', category: 'rotating', alt: 'Additional dinosaur plush friend'},
    {name: 'Highland Cow', image: 'highland.webp', category: 'rotating', alt: 'Highland Cow plush friend'},
    {name: 'Snowman', image: 'Snowman.webp', category: 'seasonal', alt: 'Seasonal Snowman plush friend'},
    {name: 'Christmas Unicorn', image: 'xmasunicorn.webp', category: 'seasonal', alt: 'Seasonal Christmas Unicorn plush friend'},
    {name: 'Christmas Pup', image: 'xmasdog.webp', category: 'seasonal', alt: 'Seasonal Christmas Pup plush friend'}
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
