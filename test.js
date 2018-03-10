setTimeout(test, 8000, 2);
function test(index, x){
  document.getElementsByClassName('post_share')[index].click()
  setTimeout(send, 1000, index)
}
function send(index){
  cur.sbSend()
  setTimeout(test, 8000, index+1)
}
