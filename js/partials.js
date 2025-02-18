fetch ('partials/head.html')
.then (response=>response.text())
.then (data=>document.getElementById('head_contenido').innerHTML=data);

fetch ('partials/header.html')
.then (response=>response.text())
.then (data=>document.getElementById('header_contenido').innerHTML=data);

fetch ('partials/footer.html')
.then (response=>response.text())
.then (data=>document.getElementById('footer_contenido').innerHTML=data);