document.getElementById('promoCheckbox').addEventListener('change', e => {
  document.getElementById('promoBox').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('cardNumber').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
});

document.getElementById('exp').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  e.target.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v;
});

document.getElementById('billingToggle').addEventListener('click', e => {
  if (e.target.tagName === 'SPAN') {
    document.querySelectorAll('#billingToggle span').forEach(el => el.classList.remove('active'));
    e.target.classList.add('active');
  }
});
