/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

// add an image to the gallery
export function addImage(title, author, url) {
  const images = getImages()

  const image = {
    imageId: (images.next++).toString(),
    title: title,
    author: author,
    url: url,
    date: new Date(),
  }
  if (!images.cur) images.cur = 0
  images.items.push(image)
  localStorage.setItem('images', JSON.stringify(images))
}
// Get the JSON images object
export function getImages() {
  if (!localStorage.getItem('images'))
    localStorage.setItem(
      'images',
      JSON.stringify({ cur: null, next: 0, items: [] })
    )
  return JSON.parse(localStorage.getItem('images'))
}

// Increment to the next image
export function nextImage() {
  resetComments()
  const images = getImages()
  if (images.cur + 1 < images.items.length) {
    images.cur++
  }
  localStorage.setItem('images', JSON.stringify(images))
}

// Decrement to the previous image
export function prevImage() {
  resetComments()
  const images = getImages()
  if (images.cur > 0) {
    images.cur--
  }
  localStorage.setItem('images', JSON.stringify(images))
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
  resetComments()
  const images = JSON.parse(localStorage.getItem('images'))
  const index = images.items.findIndex((x) => x.imageId == imageId)
  if (index == -1) return
  images.items.splice(index, 1)
  if (images.cur == images.items.length && images.cur > 0) images.cur--

  if (images.items.length == 0) images.cur = null

  localStorage.setItem('images', JSON.stringify(images))

  if (!localStorage.getItem('comments')) return

  const comments = JSON.parse(localStorage.getItem('comments'))
  comments.items = comments.items.filter((x) => x.imageId != imageId)
  localStorage.setItem('comments', JSON.stringify(comments))
}

// add a comment to an image
export function addComment(imageId, author, content) {
  const comments = JSON.parse(localStorage.getItem('comments'))

  const comment = {
    commentId: (comments.next++).toString(),
    imageId: imageId,
    author: author,
    content: content,
    date: new Date(),
  }

  comments.items.push(comment)
  localStorage.setItem('comments', JSON.stringify(comments))
}

// Get all comments belonging to an image
export function getComments(imageId) {
  if (!localStorage.getItem('comments'))
    localStorage.setItem(
      'comments',
      JSON.stringify({ cur: 0, next: 0, items: [] })
    )

  const comments = JSON.parse(localStorage.getItem('comments'))
  comments.items = comments.items.filter((x) => x.imageId == imageId)
  return comments
}
// delete a comment to an image
export function deleteComment(commentId) {
  const comments = JSON.parse(localStorage.getItem('comments'))
  const index = comments.items.findIndex((x) => {
    return x.commentId == commentId
  })
  if (index == -1) return
  comments.items.splice(index, 1)
  localStorage.setItem('comments', JSON.stringify(comments))
}

// Bring pointer to 10 newer comments
export function newerComments() {
  const comments = JSON.parse(localStorage.getItem('comments'))
  comments.cur--
  localStorage.setItem('comments', JSON.stringify(comments))
}

// Bring pointer to 10 older comments
export function olderComments() {
  const comments = JSON.parse(localStorage.getItem('comments'))
  comments.cur++
  localStorage.setItem('comments', JSON.stringify(comments))
}

// Reset the comment pointer to the newest comments
export function resetComments() {
  const comments = JSON.parse(localStorage.getItem('comments'))
  comments.cur = 0
  localStorage.setItem('comments', JSON.stringify(comments))
}
