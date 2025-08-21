let controller;
let isStopedLoding = 0;
let isLoadingMessage = 0;

let textarea = document.querySelector(".tagInput");
textarea.addEventListener("input", () => {
    textarea.style.height ="auto";
    textarea.style.height = textarea.scrollHeight + "px";
});
document.addEventListener("keydown", e =>{
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if ( isLoadingMessage=== 0){
            add_mess();
            loadingMessage();
        }
    }
})
function loadingMessage(){
    isLoadingMessage = 1;
    let img_loading = document.querySelector('.img-loading');
    img_loading.style.display = 'block';
}

function stopLoadingMessage(){
    let img_loading = document.querySelector('.img-loading');
    img_loading.style.display = 'none';
    console.log('abort');
    controller.abort();
    isStopedLoding = 1;
    isLoadingMessage = 0;
}
function getIMGsending(){
    let imgLoading = document.querySelector('.img-loading');
    imgLoading.style.display = 'none';
}

//<img src="./sendingImg.png" class="img-sending" onclick="add_mess()"
document.querySelector('.img-sending').addEventListener('click', ()=>{
    loadingMessage();
    add_mess;
})
function add_mess(){
    let container_big = document.querySelector('.container');
    let message = document.querySelector('.tagInput');
    message.value = message.value.trim();
    if (message.value === '')  {
        return;
    }
    loadingMessage();
    let container = document.querySelector('.chat-box');
    if (container.textContent === 'Xin chào! Tôi là trợ lý ảo hỗ trợ tra cứu về hành chính và đoàn viên thanh niên. Tôi có thể giúp gì cho bạn?'){
        container.textContent = '';
        container.style.textAlign = 'end';
        container.style.fontWeight = '425';
        container_big.style.marginTop = '80px';
    }

    let container_message = document.createElement("div");
    container_message.classList.add('container-message');


    let new_message = document.createElement("div");
    new_message.classList.add('user-messages');
    new_message.classList.add('message');
    new_message.textContent = message.value;
    container_message.appendChild(new_message);
    container.appendChild(container_message);
    message.style.height = 'auto';
    message.value = '';
    On_typing();
    callAPI(new_message.textContent);
    
}

function On_typing(){
    let chatBox = document.querySelector('.chat-box');
    let container = document.createElement('div');
    container.classList.add('container-AIpic-typing')
    container.innerHTML+= "<img src='./AI_pic.png' class='img-AI'>";
    
    let typing = document.createElement('div');
    typing.classList.add('loadingmess');
    typing.classList.add('container-loadingmess');
    typing.innerHTML= '<span></span><span></span><span></span>';
    typing.style.display = 'inline-block';
    container.appendChild(typing);
    chatBox.appendChild(container);
}

function off_typing(){
    let typing=document.querySelector('.container-loadingmess');
    typing.style.display = 'none';
    typing.remove();
}

function add_AI_mess(message){
    off_typing();
    let container = document.querySelector('.chat-box');
    let container_message = document.createElement("div");
    container_message.classList.add('container-message');
    container_message.style.alignSelf = 'start';
    let new_message = document.createElement("div");
    new_message.classList.add('AI-messages');
    new_message.classList.add('message');
    new_message.classList.add('AIMess');
    if (message !== 'Oops! Có lỗi xảy ra') {
        // new_message.classList.add('typingMessage');
        new_message.innerHTML = message;
    }
    else new_message.textContent = message;

    container_message.appendChild(new_message);
    container.appendChild(container_message);
}

async function callAPI(userMess){
    controller = new AbortController();
    let signal = controller.signal;
    try {
        const respondse = await fetch('https://backend-api-trolyaodoan.onrender.com/chat',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    message: userMess
                }),  signal 
            }
        )
        const data  = await respondse.json();
        await add_AI_mess(marked.parse(data.choices[0].message.content));
    } catch (error) {
        console.log(error);
        if (isStopedLoding === 0) add_AI_mess('Oops! Có lỗi xảy ra')
        else {
            isStopedLoding = 0;
            add_AI_mess('...');
        }
        isLoadingMessage = 0;
    }
    await getIMGsending();

}   



