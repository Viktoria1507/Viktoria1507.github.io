const input=document.getElementById('item'),
add=document.getElementById('add'),
list=document.getElementById('list');

function addItem(){
  if(!input.value.trim())return;
  const li=document.createElement('li'),
  span=document.createElement('span');
  span.textContent=input.value.trim();

  const edit=document.createElement('button');
  edit.textContent='Edit';
  edit.onclick=()=>{let t=prompt('Edit:',span.textContent);
    if(t?.trim())span.textContent=t.trim();
  };

  const del=document.createElement('button');
  del.textContent='Delete';
  del.onclick=()=>confirm('Delete item?')&&li.remove();

  li.append(span,edit,del);
  list.appendChild(li);
  input.value='';input.focus();
}

add.onclick=addItem;
input.onkeypress=e=>e.key==='Enter'&&addItem();
