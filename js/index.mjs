import {
  olderComments,
  newerComments,
  addComment,
  nextImage,
  deleteComment,
  addImage,
  getComments,
  deleteImage,
  getImages,
  prevImage,
} from './api.mjs'

const update = () => {
  const images = getImages()

  // Setting default values to be disabled/cleared
  document.getElementById('image-display').innerHTML = ''
  document.getElementById('comment_section').innerHTML = ''
  document.getElementById('prev_image').disabled = true
  document.getElementById('next_image').disabled = true
  document.getElementById('newer').disabled = true
  document.getElementById('older').disabled = true
  document.getElementById('prev_image').style.color = 'gray'
  document.getElementById('next_image').style.color = 'gray'
  document.getElementById('newer').style.color = 'gray'
  document.getElementById('older').style.color = 'gray'
  document.getElementById('comments').style.visibility = 'hidden'
  document.querySelector('.image_buttons').style.visibility = 'hidden'

  if (images.items.length > 0) {

    //Making everything visible
    document.getElementById('comments').style.visibility = 'visible'
    document.querySelector('.image_buttons').style.visibility = 'visible'
    const image = images.items[images.cur]
    document.getElementById('image-display').innerHTML = `
            <div id="image-heading">
                <p class="subheading">${image.title}</p>
                <div id="delete_image"></div>
            </div>
            <p>By ${image.author}</p>
            <img src="${image.url}" alt="${image.url}"/>
            
        `
    document
      .getElementById('image-display')
      .querySelector('#delete_image')
      .addEventListener('click', (e) => {
        deleteImage(image.imageId)
        update()
      })

    // Adding the comment section
    const comments = getComments(image.imageId)

    const commentSection = document.getElementById('comment_section')
    comments.items.forEach((x, i) => {
      if (
        i <= comments.items.length - 1 - comments.cur * 10 &&
        i > comments.items.length - 1 - (comments.cur + 1) * 10
      ) {
        const elmt = document.createElement('div')
        elmt.innerHTML = `
            <div class="comment">
                <div class="comment_content">
                    <div class="comment_header">
                        <p>${x.author}</p>
                        <p>${x.date.substring(0, 10)}</p>
                    </div>
                    <div class="comment_context">
                        <p>${x.content}</p>
                        <div class="delete_button"></div>
                    </div>
                </div>
            </div>
        `
        elmt.querySelector('.delete_button').addEventListener('click', (e) => {
          deleteComment(x.commentId)
          update()
        })
        commentSection.prepend(elmt)
      }
    })


    // Disabling/enabling buttons for next image, previous image, newer comments and older comments
    if (images.cur > 0) {
        document.getElementById('prev_image').disabled = false
        document.getElementById('prev_image').style.color = 'white'
    }
    if (images.cur + 1 < images.items.length) {
      document.getElementById('next_image').disabled = false
      document.getElementById('next_image').style.color = 'white'
    }
    if (comments.cur > 0) {
        document.getElementById('newer').disabled = false
        document.getElementById('newer').style.color = 'white'
    } 
    if (comments.cur * 10 + 10 < comments.items.length) {
      document.getElementById('older').disabled = false
      document.getElementById('older').style.color = 'white'
    }
  }
}


document.getElementById('add_image_form').addEventListener('submit', (e) => {
  e.preventDefault()

  const title = document.getElementById('image_title').value
  const author = document.getElementById('image_author').value
  const url = document.getElementById('image_url').value

  addImage(title, author, url)
  document.getElementById('add_image_form').reset()
  update()
})

document
  .getElementById('comment_section_form')
  .addEventListener('submit', (e) => {
    e.preventDefault()

    const author = document.getElementById('comment_author').value
    const content = document.getElementById('comment_content').value
    const images = getImages()
    const imageId = images.items[images.cur].imageId

    addComment(imageId, author, content)
    document.getElementById('comment_section_form').reset()
    update()
  })

document.getElementById('next_image').addEventListener('click', (e) => {
  nextImage()
  update()
})

document.getElementById('prev_image').addEventListener('click', (e) => {
  prevImage()
  update()
})

document.getElementById('newer').addEventListener('click', (e) => {
  newerComments()
  update()
})

document.getElementById('older').addEventListener('click', (e) => {
  olderComments()
  update()
})

document.getElementById('add_image_form').style.visibility = 'hidden'
document.getElementById('add_image_form').style.height = '0px'

// Toggle event to show/hide the toggle for 'Add image'
document.querySelector('.toggle').addEventListener('click', (e) => {
  if (e.target.innerHTML == 'Show') {
    document.getElementById('add_image_form').style.visibility = 'visible'
    document.getElementById('add_image_form').style.height = '200px'
    e.target.innerHTML = 'Hide'
  } else {
    document.getElementById('add_image_form').style.visibility = 'hidden'
    document.getElementById('add_image_form').style.height = '0px'
    e.target.innerHTML = 'Show'
  }
})

update()
