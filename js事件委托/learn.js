let ul = document.getElementById('ul');
let num = 4;
ul.addEventListener('click', function (e) {
    // if(e.target.nodeName.toLowerCase() == 'li')
    // {
    //     alert('hello');
    // }
   
    for (let i = 1; i <= num; i++) {
        let li_id = '#li_' + i;
        if (e.target.matches(li_id)) {
            alert('hello,I am li_' + i);
        }
    }
});

document.getElementById('add_li').addEventListener('click', function (e) {
    num++;
    let li = document.createElement('li');
    li.id = 'li_' + num;
    li.innerHTML = num;
    ul.appendChild(li);
});