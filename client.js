const socket=io('http://localhost:8000');

const from =document.getElementById('send-container');
const messageInput =document.getElementById('messageInp')
const messageContainer=document.querySelector(".container")
const emojiBtn=document.querySelector('#emoji-btn');
var audio = new Audio('ting.mp3');

const picker = new EmojiButton();

//upload
const imageInput=document.querySelector('#upload');
var uploadImage ="";

imageInput.addEventListener("change",function(){
    const reader =new FileReader();
    reader.addEventListener("load",()=>{
        uploadImage=reader.result;
        document.querySelector(".container").style.backgroundImage=url `(${uploadImage})`;
    });
    reader.readAsDataURL(this.files[0]);
})

// Emoji selection  
window.addEventListener('DOMContentLoaded', () => {

    picker.on('emoji', emoji => {
      document.querySelector('input').value += emoji;
    });
    emojiBtn.addEventListener('click', () => {
        picker.togglePicker(emojiBtn);
      });
    }); 



function changeFontStyle(e){

    const text=document.querySelector('.container');
    if(e.target.id=="bold"){
        e.target.classList.toggle('active');
        text.classList.toggle('bold');
    }
    if(e.target.id=="italic"){
        e.target.classList.toggle('active');
        text.classList.toggle('italic');
    }
}

const btnAction=document.querySelector('.btn-action');
btnAction.addEventListener('click',changeFontStyle);

const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
    audio.play();
    }
}

from.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right')
    socket.emit('send',message);
    messageInput.value=''
})

const name=prompt("Enter your name to join");
socket.emit('new-user-joined',name);

socket.on('user-joined',name =>{
append(`${name} joined the chat`,'right')
})

socket.on('receive',data =>{
    append(`${data.name}:${data.message}`,'left')
    })

socket.on('left',name =>{
    append(`${name} left the chat`,'left')
    })    

